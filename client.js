import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'

import './snake.css'

// canvas related
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
const WIDTH = canvas.width
const HEIGHT = canvas.height

const DIMENSIONS = { x: WIDTH, y: HEIGHT }
const UNIT_SIZE = 20
let timeCounter = 0
let previousTimestamp = null
let lastKey = null

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

let socket = new WebSocket('ws://192.168.1.4:8080')

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

let keyPress$ = fromEvent(document, 'keydown')
	.compose(
		dropRepeats((current, last) => {
			// if anything evaluates to true - ignore it
			switch (current.key) {
				case 'ArrowLeft':
					if (last.key === 'ArrowRight') return true
					return last.key === current.key
				case 'ArrowRight':
					if (last.key === 'ArrowLeft') return true
					return last.key === current.key
				case 'ArrowUp':
					if (last.key === 'ArrowDown') return true
					return last.key === current.key
				case 'ArrowDown':
					if (last.key === 'ArrowUp') return true
					return last.key === current.key
				default:
					return true
			}
		}),
	)
	.filter(event => {
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowRight':
			case 'ArrowUp':
			case 'ArrowDown':
				return true
			default:
				return false
		}
	})

keyPress$.addListener({
	next: keyEvent => {
		if (socket.readyState != 0) {
			socket.send(
				JSON.stringify({
					type: 'CHANGE_DIRECTION',
					id: playerId,
					direction: keyEvent.key.slice(5).toUpperCase(),
				}),
			)
		}
	},
	error: err => console.error(err),
	complete: () => console.log('completed'),
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
	ctx.fillStyle = color
	ctx.fillRect(scale(x), scale(y), scale(), scale())
	ctx.stroke()
}

function drawOnSocketMessage() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT)
	ctx.fillStyle = '#EBEEB8'
	ctx.fillRect(0, 0, scale(gridColumns), scale(gridRows))
	state.players.forEach(player => {
		player.body.forEach((bodyString, index) => {
			let [x, y] = strToCoords(bodyString)
			drawUnit(x, y, 'green')
		})
	})
	Object.keys(state.food).forEach(key => {
		let [x, y] = strToCoords(key)
		drawUnit(x, y, 'red')
	})
}
