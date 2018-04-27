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
const { broadcast, directionToKey, getRandomDirection } = require('./utils')
const { GRID_COLUMNS, GRID_ROWS, LOOP_REPEAT_INTERVAL } = require('./constants')
const initialGameState = require('./initial_game_state')
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
let prevImageQueueLength = 0
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
	const startingKey = directionToKey(startingDirection)

	ws.send(
		JSON.stringify({
			type: 'GAME_CONNECTION',
			id: ws.id,
			startingKey,
			GRID_COLUMNS,
			GRID_ROWS,
		}),
	)

	if (wss.clients.size == 1) {
		gameRunning = true
		gameLoop(initialGameState)
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
		prevImageQueueLength--
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
function gameLoop({ players, food, mines, mineState }) {
	if (!gameRunning) return

	////////////////////////
	// state reduction
	const updatedPlayers = connectionUpdate(
		{ players, food, mines },
		connectionQueue,
		imageQueue,
	)

	const playersAfterMove = move(
		updatedPlayers,
		directionQueue,
		GRID_COLUMNS,
		GRID_ROWS,
	)

	const updatedState = reduceState({
		players: playersAfterMove,
		food,
		mines,
		mineState,
	})
	////////////////////////

	broadcast(wss.clients, {
		type: 'STATE_UPDATE',
		state: updatedState,
	})

	// console.log('updatedState', updatedState)
	if (imageQueue.length != prevImageQueueLength) {
		console.log('sending IMAGE_UPDATE message')
		console.log(
			`current imageQueue length: ${
				imageQueue.length
			}, previous imageQueue length: ${prevImageQueueLength}`,
		)
		prevImageQueueLength++
		imageQueue.forEach(img => {
			broadcast(wss.clients, {
				type: 'IMAGE_UPDATE',
				images: imageQueue,
			})
		})
	}
	setTimeout(() => gameLoop(updatedState), LOOP_REPEAT_INTERVAL)
}
////////////////////////

server.listen(3000, () => {
	console.log('SERVER STARTING --- Listening on %d', server.address().port)
})
