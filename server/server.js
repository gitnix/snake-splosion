const fs = require('fs')
const path = require('path')

const express = require('express')
const http = require('http')

const WebSocket = require('ws')
const uuid = require('uuid')
const app = express()

app.use(express.static('client/assets'))
app.use(express.static('dist'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const R = require('ramda')
const move = require('./state_functions/move')

const processFoodCollisions = require('./state_functions/collision_process/food')
const processPlayerCollisions = require('./state_functions/collision_process/player')

const getStateAfterTeleportingPlayers = require('./state_functions/position_update/player')
const updateFoodPositions = require('./state_functions/position_update/food')

const updatePlayersFromConnections = require('./state_functions/updatePlayersFromConnections')
const { directionToKey, getRandomDirection } = require('./utils')
const { gridSize, LOOP_REPEAT_INTERVAL } = require('./constants')
// For now the grid is a square
// will entertain more possibilites later
const gridColumns = gridSize
const gridRows = gridSize

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
	let startingDirection = getRandomDirection()
	directionQueue[ws.id] = [startingDirection]
	let startingArrowKey = directionToKey(startingDirection)

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
		})
	}

	ws.on('message', message => {
		let { type, id, direction } = JSON.parse(message)
		switch (type) {
			case 'CHANGE_DIRECTION':
				directionQueue[id].push(direction)
				break
		}
	})

	// disconnections throw errors
	// will fail without err callback
	ws.on('error', err => {
		if (err.code === 'ECONNRESET') {
			console.log('A connection is set to be closed')
		} else {
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

	let updatedPlayers = updatePlayersFromConnections(
		{ players: state.players, food: state.food },
		connectionQueue,
		imageQueue,
	)

	let playersAfterMove = move(
		updatedPlayers,
		directionQueue,
		gridColumns,
		gridRows,
	)

	let updatedState = R.compose(
		getStateAfterTeleportingPlayers,
		processPlayerCollisions,
		updateFoodPositions,
		processFoodCollisions,
	)({
		players: playersAfterMove,
		food: state.food,
	})

	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN)
			client.send(
				JSON.stringify({
					type: 'STATE_UPDATE',
					state: updatedState,
				}),
			)
	})

	imageQueue.forEach(img => {
		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN)
				client.send(
					JSON.stringify({
						type: 'IMAGE_UPDATE',
						images: imageQueue,
					}),
				)
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
