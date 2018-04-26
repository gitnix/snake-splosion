const { append, equals, findIndex, length, reduce, remove } = require('ramda')
const {
	getValidRandomKey,
	getAllOccupiedPositions,
	newBody,
} = require('../utils')
const { DEATH_TICKS, GOAL_SCORE } = require('../constants')
const getSnakeName = require('../get_snake_names')
const getSnakeImage = require('../image_search')

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

	return foundIndex > -1
		? stored
		: append(
				{
					id: currentId,
					body: newBody(randomKey),
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
	{ players, food },
	{ connections, disconnections },
	imageQueue,
) => {
	if (equals(length(connections, disconnections), 0)) return players

	const randomKey = getValidRandomKey(
		getAllOccupiedPositions({ players, food }),
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
