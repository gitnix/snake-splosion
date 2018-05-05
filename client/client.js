import { protocol } from './client_dev'
import { UNIT_SIZE } from './constants'
import { playAudio, setBackgroundImage, updateGame, updateUI } from './update'
import { scale, strToCoords } from './utils'
import addKeyListener from './key_listener'

import './assets/snake.css'

// canvas where main game is drawn
const canvas1 = document.getElementById('layer-1')
const layer1 = canvas1.getContext('2d')
// canvas internal width/height (differnet from css)
const WIDTH = canvas1.width
const HEIGHT = canvas1.height

// canvas where extra effects are drawn
// const canvasTop = document.getElementById('layer-2')
// const layer2 = canvasTop.getContext('2d')

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
let GRID_COLUMNS = null
let GRID_ROWS = null
let mineTypeToDraw = null
////////////////////////

let savedColorHash = null

const hashCode = (str, savedColorHash) => {
	let hash = 0
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	return hash
}

const pickColor = (str, lightness) => {
	return `hsl(${hashCode(str) % 360}, 100%, ${lightness}%)`
}

let state = {}

const socket = new WebSocket(`${protocol}://${location.host}`)

socket.addEventListener('open', () => {
	console.log('successful connection')
})

socket.addEventListener('message', message => {
	const msg = JSON.parse(message.data)
	switch (msg.type) {
		case 'STATE_UPDATE':
			state = msg.state
			playAudio(state.players, playerId)
			updateGame(state, layer1, {
				width: WIDTH,
				height: HEIGHT,
				cols: GRID_COLUMNS,
				rows: GRID_ROWS,
				mineTypeToDraw,
				info: state.gameInfo,
			})
			updateUI(state.players, playerId)
			break
		case 'GAME_CONNECTION':
			playerId = msg.id
			GRID_COLUMNS = msg.GRID_COLUMNS
			GRID_ROWS = msg.GRID_ROWS
			addKeyListener(msg.startingKey, socket, playerId)
			setBackgroundImage(msg.backgroundImage)
			mineTypeToDraw = msg.backgroundImage === 'night_sand' ? 'LIGHT' : 'DARK'
			break
		case 'IMAGE_UPDATE':
			msg.images.forEach(imgArray => {
				// fix this to work for multiple players
				if (imgArray[0] === playerId)
					document.getElementById('p1-image').src = imgArray[1]
				if (imgArray[0] !== playerId)
					document.getElementById('p2-image').src = imgArray[1]
			})
			break
	}
})

window.addEventListener('beforeunload', () => {
	socket.close(JSON.stringify({ id: playerId }))
})
