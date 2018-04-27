const {
	DIRECTIONS,
	GRID_COLUMNS,
	GRID_ROWS,
	NEW_BODY_LENGTH,
} = require('./constants')

const WebSocket = require('ws')
const { chain } = require('ramda')

const broadcast = (clients, obj) => {
	clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(obj))
	})
}

const directionToKey = dir => {
	switch (dir) {
		case 'UP':
			return 'ArrowUp'
		case 'DOWN':
			return 'ArrowDown'
		case 'LEFT':
			return 'ArrowLeft'
		case 'RIGHT':
			return 'ArrowRight'
	}
}

const getRandom = bounds => Math.floor(Math.random() * bounds)
const getRandomKey = () =>
	'' + getRandom(GRID_COLUMNS) + '_' + getRandom(GRID_ROWS)
const getValidRandomKey = array => {
	let randomKey = getRandomKey()
	while (array.includes(randomKey)) {
		randomKey = getRandomKey()
	}
	return randomKey
}

const getAllFoodPositions = food => Object.keys(food)
const getAllMinePositions = mines => Object.keys(mines)
const getAllPlayerPositions = players => chain(player => player.body, players)

const getAllOccupiedPositions = ({ players, food, mines }) => [
	...getAllPlayerPositions(players),
	...getAllFoodPositions(food),
	...getAllMinePositions(mines),
]

const getRandomDirection = () =>
	DIRECTIONS[Math.round(Math.random() * (DIRECTIONS.length - 1))]

const newBody = key => new Array(NEW_BODY_LENGTH).fill(key)

module.exports = {
	broadcast,
	directionToKey,
	getValidRandomKey,
	getAllFoodPositions,
	getAllPlayerPositions,
	getAllOccupiedPositions,
	getRandom,
	getRandomDirection,
	newBody,
}
