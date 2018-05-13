const {
	BACKGROUNDS,
	COLORS,
	DIRECTIONS,
	GRID_COLUMNS,
	GRID_ROWS,
	MINE_SPAWN_DISTANCE,
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

const getCoordsAroundPoint = (x, y) => {
	return [
		keysToString(x, y - 1),
		keysToString(x, y + 1),
		keysToString(x - 1, y),
		keysToString(x + 1, y),
	]
}

const getCoordSet = (x, y, distance = 2) => {
	let coordSet = new Set()
	for (let i = 0; i < distance; i++) {
		if (i == 0) {
			getCoordsAroundPoint(x, y).forEach(coord => coordSet.add(coord))
		} else {
			getCoordsAroundPoint(x + i, y).forEach(coord => coordSet.add(coord))
			getCoordsAroundPoint(x - i, y).forEach(coord => coordSet.add(coord))
			getCoordsAroundPoint(x, y + i).forEach(coord => coordSet.add(coord))
			getCoordsAroundPoint(x, y - i).forEach(coord => coordSet.add(coord))
		}
	}
	return coordSet
}

const getCollisionStatusAndKey = (allPosArray, playersArray) => {
	let randX = getRandom(GRID_COLUMNS)
	let randY = getRandom(GRID_ROWS)
	let randomKey = keysToString(randX, randY)
	while (allPosArray.includes(randomKey)) {
		randX = getRandom(GRID_COLUMNS)
		randY = getRandom(GRID_ROWS)
		randomKey = keysToString(randX, randY)
	}

	if (!playersArray || !playersArray.length) {
		return [false, randomKey]
	}

	let perimeterSet = getCoordSet(randX, randY, MINE_SPAWN_DISTANCE)
	playersArray.forEach(p => {
		perimeterSet.forEach(coord => {
			if (coord === p.body[0]) {
				return [true, null]
			}
		})
	})

	return [false, randomKey]
}

const getRandom = bounds => Math.floor(Math.random() * bounds)
const keysToString = (x, y) => '' + x + '_' + y
const getValidRandomKey = (allPosArray, playersArray) => {
	let distanceCheck = true
	let key = null
	while (distanceCheck) {
		;[distanceCheck, key] = getCollisionStatusAndKey(allPosArray, playersArray)
	}
	return key
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

const getRandomColor = players => {
	let currentColors = players.map(p => p.color)
	let color = COLORS[Math.round(Math.random() * (COLORS.length - 1))]
	while (currentColors.includes(color)) {
		color = COLORS[Math.round(Math.random() * (COLORS.length - 1))]
	}
	return color
}

const getRandomDirection = () =>
	DIRECTIONS[Math.round(Math.random() * (DIRECTIONS.length - 1))]

const newBody = key => new Array(NEW_BODY_LENGTH).fill(key)

const newBodyDirections = (bodyDirections, { type, direction }) => {
	switch (type) {
		case 'move':
			return bodyDirections
				? [direction, ...bodyDirections.slice(0, bodyDirections.length - 1)]
				: new Array(NEW_BODY_LENGTH).fill(direction)
		case 'add':
			return bodyDirections.concat(direction)
		case 'remove':
			return bodyDirections.slice(0, bodyDirections.length - 1)
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
	getRandomColor,
	getRandomDirection,
	newBody,
	newBodyDirections,
}
