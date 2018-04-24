import { localIp } from './client_dev'
import addKeyListener from './key_listener'

import './snake.css'

// canvas related
let canvasBottom = document.getElementById('bottom-scene')
let layer1 = canvasBottom.getContext('2d')
const WIDTH = canvasBottom.width
const HEIGHT = canvasBottom.height

let canvasTop = document.getElementById('top-scene')
let layer2 = canvasTop.getContext('2d')

const DIMENSIONS = { x: WIDTH, y: HEIGHT }
const UNIT_SIZE = 20
let timeCounter = 0
let previousTimestamp = null
let lastKey = null

// test blob for second canvas
// const drawOtherStuff = (x, y, color) => {
// 	layer2.clearRect(0, 0, WIDTH, HEIGHT)
// 	layer2.fillStyle = 'blue'
// 	layer2.fillRect(30, 30, 100, 100)
// 	layer2.stroke()
// 	window.requestAnimationFrame(drawOtherStuff)
// }
// window.requestAnimationFrame(drawOtherStuff)

////////////////////////
// initialized on server connection
let playerId = null
let gridColumns = null
let gridRows = null
////////////////////////

// look into this
// let playerImageMap = new Map()

let savedColorHash = null

function hashCode(str, savedColorHash) {
	let hash = 0
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	return hash
}

function pickColor(str, lightness) {
	return `hsl(${hashCode(str) % 360}, 100%, ${lightness}%)`
}

let state = {}

let socket = new WebSocket(`ws://${localIp}:8080`)

socket.addEventListener('open', () => {
	console.log('successful connection')
})

const updateScores = () => {
	state.players.forEach(player => {
		// brute forcing for now
		document.getElementById('p1-score').innerHTML = player.score + ' pts'
		document.getElementById('p1-name').innerHTML = player.name
		if (player.state === 'dead') {
			let pImage = document.getElementById('p1-image')
			if (!pImage.classList.contains('dead')) {
				pImage.classList.add('dead')
			}
		}
	})
}

socket.addEventListener('message', message => {
	let msg = JSON.parse(message.data)
	switch (msg.type) {
		case 'STATE_UPDATE':
			state = msg.state
			drawOnSocketMessage()
			updateScores()
			break
		case 'GAME_CONNECTION':
			playerId = msg.id
			gridColumns = msg.gridColumns
			gridRows = msg.gridRows
			addKeyListener(msg.startingKey, socket, playerId)
			break
		case 'IMAGE_UPDATE':
			msg.images.forEach(imgArray => {
				document.getElementById('p1-image').src = imgArray[1]
				document.getElementById('p2-image').src = imgArray[1]
			})
			break
	}
})

window.addEventListener('beforeunload', function() {
	socket.close(JSON.stringify({ id: playerId }))
})

// document.addEventListener('click', () =>
// 	socket.send(
// 		JSON.stringify({
// 			type: 'STOP_AND_LOG',
// 			id: playerId,
// 		}),
// 	),
// )

const scale = (val = 1) => val * UNIT_SIZE

const strToCoords = key => key.split('_').map(string => parseInt(string))

const drawUnit = (x, y, color) => {
	layer1.fillStyle = color
	layer1.fillRect(scale(x), scale(y), scale(), scale())
	layer1.stroke()
}

function drawOnSocketMessage() {
	layer1.clearRect(0, 0, WIDTH, HEIGHT)
	layer1.fillStyle = '#EBEEB8'
	layer1.fillRect(0, 0, scale(gridColumns), scale(gridRows))

	Object.keys(state.food).forEach(key => {
		let [x, y] = strToCoords(key)
		drawUnit(x, y, 'red')
	})

	state.players.forEach(player => {
		player.body.forEach((bodyString, index) => {
			let [x, y] = strToCoords(bodyString)
			if (player.state === 'teleported') {
				// for future
				// get location and set function in motion to draw a teleport thing over specified time
			}
			if (player.state === 'dead') drawUnit(x, y, 'gray')
			else drawUnit(x, y, 'green')
		})
	})
}
