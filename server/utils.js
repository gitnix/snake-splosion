const {
	gridColumns,
	gridRows,
	newBodyLength,
	possibleDirections,
} = require('./constants')

const WebSocket = require('ws')
const { chain, concat } = require('ramda')

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
	'' + getRandom(gridColumns) + '_' + getRandom(gridRows)
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

const getAllOccupiedPositions = ({ players, food, mines }) =>
	concat(
		getAllPlayerPositions(players),
		getAllFoodPositions(food),
		getAllMinePositions(mines),
	)

const getRandomDirection = () =>
	possibleDirections[
		Math.round(Math.random() * (possibleDirections.length - 1))
	]

const newBody = key => new Array(newBodyLength).fill(key)

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
