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
const { compose } = require('ramda')
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
} = require('./constants')
const initialGameState = require('./initial_game_state')
////////////////////////
// server specific state
let playerSet = new Set()
let spectating = false
let backgroundImage
let gameRunning = false
let directionQueue = {}
let connectionQueue = {
	connections: [],
	disconnections: [],
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
	if (playerSet.size >= MAX_PLAYERS) {
		spectating = true
	} else {
		playerSet.add(ws.id)
		connectionQueue.connections.push(ws.id)
		startingDirection = getRandomDirection()
		directionQueue[ws.id] = [startingDirection]
		startingKey = directionToKey(startingDirection)
	}

	if (!spectating && playerSet.size === 1) {
		backgroundImage = getRandomBackgroundImage()
		gameRunning = true
		gameLoop(initialGameState)
	}

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
		const { type, id, direction } = msg
		switch (type) {
			case 'CHANGE_DIRECTION':
				directionQueue[id].push(direction)
				break
			case 'CHAT_MESSAGE':
				broadcast(wss.clients, {
					type: 'CHAT_MESSAGE',
					message: {
						contents: msg.contents,
						sender: msg.sender,
						color: msg.color,
					},
				})
		}
	})

	ws.on('close', (code, reason) => {
		console.log(`Closing connection for ${ws.id}`)
		if (playerSet.size <= MAX_PLAYERS) {
			connectionQueue.disconnections.push(ws.id)
			playerSet.delete(ws.id)
		}
		if (playerSet.size === 0 && reason !== 'noMorePlayers') {
			console.log('All players have left', 'STOPPING GAME')
			connectionQueue.connections = []
			connectionQueue.disconnections = []
			spectating = false
			playerSet.clear()
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
function gameLoop({ players, food, mines, mineState, gameInfo }) {
	if (!gameRunning) return

	////////////////////////
	// state reduction
	const updatedPlayers = connectionUpdate(
		{ players, food, mines },
		connectionQueue,
	)

	const playersAfterMove = move(updatedPlayers, directionQueue, [
		GRID_COLUMNS,
		GRID_ROWS,
	])

	const updatedState = reduceState({
		players: playersAfterMove,
		food,
		mines,
		mineState,
		gameInfo,
	})
	////////////////////////

	broadcast(wss.clients, {
		type: 'STATE_UPDATE',
		state: updatedState,
	})

	setTimeout(() => gameLoop(updatedState), LOOP_REPEAT_INTERVAL)
}
////////////////////////

server.listen(3000, () => {
	console.log('SERVER STARTING --- Listening on %d', server.address().port)
})
