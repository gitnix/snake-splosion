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
const { reduceState, move, connectionUpdate } = require('./reducers')
const { broadcast, directionToKey, getRandomDirection } = require('./utils')
const { gridColumns, gridRows, LOOP_REPEAT_INTERVAL } = require('./constants')

////////////////////////
// server specific state
let gameRunning = false
let directionQueue = {}
let connectionQueue = {
	connections: [],
	disconnections: [],
}
let imageQueue = [
	// ['test', 'https://media.giphy.com/media/WmQY7DwQcbPfG/giphy.gif'],
]
////////////////////////

////////////////////////
// WebSocket
wss.on('connection', (ws, req) => {
	ws.id = uuid.v4()
	console.log(`Client ${ws.id} has connected`)
	console.log(`There are currently ${wss.clients.size} connected clients`)

	connectionQueue.connections.push(ws.id)
	const startingDirection = getRandomDirection()
	directionQueue[ws.id] = [startingDirection]
	const startingArrowKey = directionToKey(startingDirection)

	ws.send(
		JSON.stringify({
			type: 'GAME_CONNECTION',
			id: ws.id,
			startingKey: startingArrowKey,
			gridColumns,
			gridRows,
		}),
	)

	if (wss.clients.size == 1) {
		gameRunning = true
		gameLoop({
			players: [],
			food: { '3_3': { score: 10, hasBeenCollided: false } },
			mines: { '7_7': { hasBeenCollided: false } },
		})
	}

	ws.on('message', message => {
		const { type, id, direction } = JSON.parse(message)
		switch (type) {
			case 'CHANGE_DIRECTION':
				directionQueue[id].push(direction)
				break
		}
	})

	// disconnections throw errors
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

	ws.on('close', () => {
		console.log(`Closing connection for ${ws.id}`)
		connectionQueue.disconnections.push(ws.id)
		if (wss.clients.size == 0) {
			console.log('All clients have left', 'STOPPING GAME')
			connectionQueue.connections = []
			connectionQueue.disconnections = []
			gameRunning = false
		}
	})
})
////////////////////////

////////////////////////
// Main Loop
function gameLoop(state) {
	if (!gameRunning) return

	const updatedPlayers = connectionUpdate(
		{ players: state.players, food: state.food },
		connectionQueue,
		imageQueue,
	)

	const playersAfterMove = move(
		updatedPlayers,
		directionQueue,
		gridColumns,
		gridRows,
	)

	const updatedState = reduceState({
		players: playersAfterMove,
		food: state.food,
		mines: state.mines,
	})

	broadcast(wss.clients, {
		type: 'STATE_UPDATE',
		state: updatedState,
	})

	imageQueue.forEach(img => {
		broadcast(wss.clients, {
			type: 'IMAGE_UPDATE',
			images: imageQueue,
		})
	})

	while (imageQueue.length) {
		imageQueue.pop()
	}
	setTimeout(() => gameLoop(updatedState), LOOP_REPEAT_INTERVAL)
}
////////////////////////

server.listen(8080, () => {
	console.log('SERVER STARTING --- Listening on %d', server.address().port)
})
