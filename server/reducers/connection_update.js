const { append, findIndex, reduce, remove } = require('ramda')
const {
	getAllOccupiedPositions,
	getRandomColor,
	getValidRandomKey,
	newBody,
} = require('../utils')
const { DEATH_TICKS, SNAKE_LOADING_IMAGE } = require('../constants')
const gameOptions = require('../constants')
const getSnakeImage = require('../image_search')
const getSnakeName = require('../get_snake_names')

const indexForId = (array, currentId) =>
	findIndex(element => element.id === currentId)(array)

const removeId = (stored, currentId) => {
	const foundIndex = indexForId(stored, currentId)
	return foundIndex > -1 ? remove(foundIndex, 1, stored) : stored
}

const addId = (gridItems, imageMap) => (stored, currentId) => {
	const randomKey = getValidRandomKey(
		getAllOccupiedPositions({ ...gridItems, players: stored }),
	)

	const foundIndex = indexForId(stored, currentId)

	let snakeName
	const playerNames = stored.map(p => p.name)

	if (foundIndex < 0) {
		imageMap.set(currentId, SNAKE_LOADING_IMAGE)
		snakeName = getSnakeName()
		while (playerNames.includes(snakeName)) snakeName = getSnakeName()
		getSnakeImage(snakeName).then(url => {
			imageMap.set(currentId, url)
		})
	}

	const color = getRandomColor(stored)

	return foundIndex > -1
		? stored
		: append(
				{
					id: currentId,
					ai: currentId.split('_')[0] === 'ai' ? true : false,
					body: newBody(randomKey),
					color,
					chat: {},
					state: 'connecting',
					name: snakeName,
					deathTicks: DEATH_TICKS,
					score: 0,
					wins: 0,
					goalScore: gameOptions.GOAL_SCORE,
				},
				stored,
		  )
}

const updatePlayersFromConnections = (
	{ players, food, mines, triggers },
	{ connections, disconnections },
	imageMap,
) => {
	if (!connections.length && !disconnections.length) {
		return players
	}

	const updatedPlayers = reduce(
		addId({ food, mines, triggers }, imageMap),
		reduce(removeId, players, disconnections),
		connections,
	)

	// clear connections
	connections.splice(0) // side effect
	disconnections.splice(0) // side effect

	return updatedPlayers
}

module.exports = updatePlayersFromConnections
