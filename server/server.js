////////////////////////
// server setup
const express = require('express')
const http = require('http')

const WebSocket = require('ws')
const uuid = require('uuid')
const app = express()

app.use(express.static('client/assets'))
app.use(express.static('dist'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

////////////////////////
// app dependencies
const { directionQueue } = require('./server_state')
const { connectionUpdate, move, reduceState } = require('./reducers')
const {
	broadcast,
	directionToKey,
	getRandomBackgroundImage,
	getRandomDirection,
} = require('./utils')
const {
	GRID_COLUMNS,
	GRID_ROWS,
	LOOP_REPEAT_INTERVAL,
	MAX_PLAYERS,
	WS_ACTIVITY_TIMEOUT,
	WS_SPECTATING_ACTIVITY_TIMEOUT,
} = require('./constants')
const initialGameState = require('./initial_game_state')
const {
	chatHelp,
	chatSetOption,
	chatListOptions,
	chatSetDefaults,
} = require('./chat_options')
////////////////////////
// server specific state
let playerArray = []
let humanSet = new Set()
let spectatorSet = new Set()
let spectating = false

let backgroundImage
let gameRunning = false
let connectionQueue = {
	connections: [],
	disconnections: [],
}
let playerImageMap = new Map()

let addAi = id => {
	playerArray.push({ id, ai: true })
	connectionQueue.connections.push(id)
	directionQueue[id] = ['RIGHT']
}
////////////////////////

////////////////////////
// WebSocket
wss.on('connection', (ws, req) => {
	let startingKey
	let startingDirection
	// disconnections or unsuccessful connections throw errors
	// will fail without err callback
	ws.on('error', err => {
		switch (err.code) {
			case 'ECONNRESET':
				console.log('A connection is set to be closed')
				break
			default:
				console.log('WEBSOCKET ERROR ------', err)
		}
	})

	ws.id = uuid.v4()
	console.log(`Client ${ws.id} has connected`)
	console.log(`There are currently ${wss.clients.size} connected clients`)
	if (humanSet.size >= MAX_PLAYERS) {
		spectating = true
		ws.spectating = true
		spectatorSet.add(ws.id)
	} else {
		playerArray.push({ id: ws.id, ai: false })
		humanSet.add(ws.id)

		substituted = false
		if (playerArray.length > MAX_PLAYERS) {
			let indexToRemove = playerArray.findIndex(player => player.ai)
			connectionQueue.disconnections.push(playerArray[indexToRemove].id)
			playerArray.splice(indexToRemove, 1)
			console.log('after substitution player array is now: ', playerArray)
		}
		connectionQueue.connections.push(ws.id)
		startingDirection = getRandomDirection()
		directionQueue[ws.id] = [startingDirection]
		startingKey = directionToKey(startingDirection)
	}

	if (playerArray.length === 1) {
		for (let i = 0; i < 3; i++) {
			addAi('ai_' + uuid.v4().slice(0, 8))
		}
		directionQueue['mouse_1'] = ['RIGHT']
	}

	if (!spectating && humanSet.size === 1) {
		backgroundImage = getRandomBackgroundImage()
		gameRunning = true
		gameLoop(initialGameState)
	}

	ws.expiration = spectating
		? WS_SPECTATING_ACTIVITY_TIMEOUT
		: WS_ACTIVITY_TIMEOUT

	ws.send(
		JSON.stringify({
			type: 'GAME_CONNECTION',
			id: ws.id,
			spectating,
			startingKey,
			backgroundImage,
			mineTypeToDraw: 'DARK',
		}),
	)

	ws.on('message', message => {
		const msg = JSON.parse(message)

		ws.expiration = ws.spectating
			? WS_SPECTATING_ACTIVITY_TIMEOUT
			: WS_ACTIVITY_TIMEOUT
		switch (msg.type) {
			case 'CHANGE_DIRECTION':
				directionQueue[msg.id].push(msg.direction)
				break
			case 'CHAT_MESSAGE':
				let dialouge
				let parsedMsg = msg.contents.split(' ')

				switch (msg.contents) {
					case 'help':
						dialouge = chatHelp()
						break
					case 'list values':
						dialouge = chatListOptions()
						break
					case 'set defaults':
						dialouge = chatSetDefaults()
						break
				}

				if (parsedMsg.length === 3) {
					if (parsedMsg[0] === 'set') {
						let parsedValue = parseInt(parsedMsg[2])
						dialouge = chatSetOption(parsedMsg[1], parsedValue)
					}
				}

				broadcast(wss.clients, {
					type: 'CHAT_MESSAGE',
					message: {
						contents: dialouge ? dialouge : msg.contents,
						sender: msg.sender,
						color: msg.color,
					},
				})
		}
	})

	ws.on('close', (code, reason) => {
		console.log(`Closing connection for ${ws.id}`)
		if (ws.spectating) {
			console.log('removing spectator')
			spectatorSet.delete(ws.id)
			if (spectatorSet.size === 0) {
				console.log('there are now no spectators')
				spectating = false
			}
			return
		}
		if (playerArray.length <= MAX_PLAYERS) {
			connectionQueue.disconnections.push(ws.id)
			let indexToRemove = playerArray.findIndex(player => player.id === ws.id)
			playerArray.splice(indexToRemove, 1)
			humanSet.delete(ws.id)
			addAi('ai_' + uuid.v4().slice(0, 8))
		}
		if (humanSet.size === 0 && reason !== 'noMorePlayers') {
			console.log('All players have left', 'STOPPING GAME')
			connectionQueue.connections = []
			connectionQueue.disconnections = []
			spectating = false
			playerArray.splice(0)
			humanSet.clear()
			playerImageMap.clear()
			gameRunning = false
			if (wss.clients.size > 0) {
				broadcast(wss.clients, {
					type: 'PLAYERS_NOT_PRESENT',
				})
				wss.clients.forEach(client => client.close(1000, 'noMorePlayers'))
			}
		}
	})
})
////////////////////////

////////////////////////
// Main Loop
function gameLoop({
	players,
	food,
	mice,
	mines,
	mineState,
	triggers,
	gameInfo,
}) {
	if (!gameRunning) {
		console.log('game was stopped')
		return
	}

	////////////////////////
	// state reduction
	const updatedPlayers = connectionUpdate(
		{ players, food, mines, triggers },
		connectionQueue,
		playerImageMap,
	)

	const { players: playersAfterMove, mice: miceAfterMove } = move(
		updatedPlayers,
		directionQueue,
		[GRID_COLUMNS, GRID_ROWS],
		playerImageMap,
		food,
		mines,
		triggers,
		mice,
	)

	const updatedState = reduceState({
		players: playersAfterMove,
		mice: miceAfterMove,
		food,
		mines,
		mineState,
		triggers,
		gameInfo,
	})
	////////////////////////

	broadcast(wss.clients, {
		type: 'STATE_UPDATE',
		state: updatedState,
	})

	wss.clients.forEach(client => {
		client.expiration--
		if (client.expiration <= 0) {
			console.log('Closing due to expiration')
			if (client.readyState === WebSocket.OPEN)
				client.send(JSON.stringify({ type: 'INACTIVITY_TIMEOUT' }))
			client.close()
		}
	})

	setTimeout(() => gameLoop(updatedState), LOOP_REPEAT_INTERVAL)
}
////////////////////////

server.listen(3000, () => {
	console.log('SERVER STARTING --- Listening on %d', server.address().port)
})
