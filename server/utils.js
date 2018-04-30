const {
	BACKGROUNDS,
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

const getRandomBackgroundImage = () =>
	BACKGROUNDS[Math.round(Math.random() * (BACKGROUNDS.length - 1))]

const getRandomDirection = () =>
	DIRECTIONS[Math.round(Math.random() * (DIRECTIONS.length - 1))]

const newBody = key => new Array(NEW_BODY_LENGTH).fill(key)

const newBodyDirections = (player, { type, direction }) => {
	switch (type) {
		case 'move':
			return player.bodyDirections
				? [
						direction,
						...player.bodyDirections.slice(0, player.bodyDirections.length - 1),
				  ]
				: new Array(NEW_BODY_LENGTH).fill(direction)
		case 'add':
			return player.bodyDirections.concat(player.direction)
		case 'remove':
			return player.bodyDirections.slice(0, player.bodyDirections.length - 1)
	}
}

module.exports = {
	broadcast,
	directionToKey,
	getValidRandomKey,
	getAllFoodPositions,
	getAllPlayerPositions,
	getAllOccupiedPositions,
	getRandom,
	getRandomBackgroundImage,
	getRandomDirection,
	newBody,
	newBodyDirections,
}
