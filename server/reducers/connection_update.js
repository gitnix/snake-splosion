const { append, findIndex, length, reduce, remove } = require('ramda')
const {
	getAllOccupiedPositions,
	getRandomColor,
	getValidRandomKey,
	newBody,
} = require('../utils')
const { DEATH_TICKS, GOAL_SCORE } = require('../constants')
const getSnakeImage = require('../image_search')
const getSnakeName = require('../get_snake_names')

const indexForId = (array, currentId) =>
	findIndex(element => element.id === currentId)(array)

const removeId = (stored, currentId) => {
	const foundIndex = indexForId(stored, currentId)
	return foundIndex > -1 ? remove(foundIndex, 1, stored) : stored
}

const addId = (randomKey, imageQueue) => (stored, currentId) => {
	const foundIndex = indexForId(stored, currentId)

	let snakeName

	if (foundIndex < 0) {
		snakeName = getSnakeName()
		getSnakeImage(snakeName).then(url => {
			imageQueue.push([currentId, url]) // side effect
		})
	}

	const color = getRandomColor(stored)

	return foundIndex > -1
		? stored
		: append(
				{
					id: currentId,
					body: newBody(randomKey),
					color,
					state: 'normal',
					name: snakeName,
					deathTicks: DEATH_TICKS,
					score: 0,
					goalScore: GOAL_SCORE,
				},
				stored,
		  )
}

const updatePlayersFromConnections = (
	{ players, food, mines },
	{ connections, disconnections },
	imageQueue,
) => {
	if (!connections.length && !disconnections.length) return players

	const randomKey = getValidRandomKey(
		getAllOccupiedPositions({ players, food, mines }),
	)

	const updatedPlayers = reduce(
		addId(randomKey, imageQueue),
		reduce(removeId, players, disconnections),
		connections,
	)

	// clear connections
	connections.splice(0) // side effect
	disconnections.splice(0) // side effect

	return updatedPlayers
}

module.exports = updatePlayersFromConnections
