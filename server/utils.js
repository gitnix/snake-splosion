const {
	BACKGROUNDS,
	COLORS,
	DIRECTIONS,
	GRID_COLUMNS,
	GRID_ROWS,
	NEW_BODY_LENGTH,
} = require('./constants')
const gameOptions = require('./constants')

const WebSocket = require('ws')
const { chain } = require('ramda')

const broadcast = (clients, obj, excludeId = null) => {
	clients.forEach(client => {
		if (client.id !== excludeId) {
			if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(obj))
		}
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
	const coordSet = new Set()
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

const getCollisionStatusAndKey = (
	allPosArray,
	playersArray,
	xRange,
	yRange,
) => {
	let randX = getRandom(xRange)
	let randY = getRandom(yRange)
	let randomKey = keysToString(randX, randY)
	while (allPosArray.includes(randomKey)) {
		randX = getRandom(xRange)
		randY = getRandom(yRange)
		randomKey = keysToString(randX, randY)
	}

	if (!playersArray || !playersArray.length) {
		return [false, randomKey]
	}

	// used when getting position for new mines
	const perimeterSet = getCoordSet(
		randX,
		randY,
		gameOptions.MINE_SPAWN_DISTANCE,
	)
	let isCollision = false
	playersArray.forEach(p => {
		perimeterSet.forEach(coord => {
			if (coord === p.body[0]) isCollision = true
		})
	})
	if (isCollision) return [true, null]

	return [false, randomKey]
}

const getRandom = bounds => Math.floor(Math.random() * bounds)
const keysToString = (x, y) => `${x}_${y}`
// playersArray does not need to be provided
// it is used for mine spawn distance
// xRange and yRange are options (will default to GRID_COLUMNS, GRID_ROWS)
const getValidRandomKey = (
	allPosArray,
	playersArray,
	xRange = GRID_COLUMNS,
	yRange = GRID_ROWS,
) => {
	let distanceCheck = true
	let key = null
	while (distanceCheck) {
		// eslint-disable-next-line
		;[distanceCheck, key] = getCollisionStatusAndKey(
			allPosArray,
			playersArray,
			xRange,
			yRange,
		)
	}
	return key
}

const getAllPlayerPositions = players => chain(player => player.body, players)

const getAllOccupiedPositions = ({ players, food, mines, triggers }) => [
	...getAllPlayerPositions(players),
	...Object.keys(food),
	...Object.keys(mines),
	...Object.keys(triggers),
]

const getRandomBackgroundImage = () =>
	BACKGROUNDS[Math.round(Math.random() * (BACKGROUNDS.length - 1))]

const getRandomColor = players => {
	const currentColors = players.map(p => p.color)
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

const strToCoords = key => key.split('_').map(string => parseInt(string))

const keysForTypes = (obj, types) =>
	Object.entries(obj)
		.filter(([, v]) => types.includes(v.type))
		.map(arr => arr[0])

const shuffle = a => {
	let j, x, i
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1))
		x = a[i]
		a[i] = a[j]
		a[j] = x
	}
	return a
}

module.exports = {
	broadcast,
	directionToKey,
	getAllOccupiedPositions,
	getAllPlayerPositions,
	getRandom,
	getRandomBackgroundImage,
	getRandomColor,
	getRandomDirection,
	getValidRandomKey,
	keysForTypes,
	keysToString,
	newBody,
	newBodyDirections,
	shuffle,
	strToCoords,
}
