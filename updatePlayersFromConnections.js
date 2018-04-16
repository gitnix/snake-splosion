const R = require('ramda')
const { getRandomKey, getAllOccupiedPositions } = require('./utils')
const getSnakeName = require('./get_snake_names')
const getSnakeImage = require('./image_search')

let findIndex = (array, currentId) =>
	R.findIndex(element => element.id === currentId)(array)

let removeId = (stored, currentId) => {
	let foundIndex = findIndex(stored, currentId)
	return foundIndex > -1 ? R.remove(foundIndex, 1, stored) : stored
}

let addId = (randomKey, imageQueue) => (stored, currentId) => {
	let foundIndex = findIndex(stored, currentId)

	let snakeName

	if (foundIndex < 0) {
		snakeName = getSnakeName()
		getSnakeImage(snakeName).then(url => {
			imageQueue.push([currentId, url])
		})
	}

	return foundIndex > -1
		? stored
		: R.append(
				{
					id: currentId,
					body: [randomKey, randomKey, randomKey],
					state: 'normal',
					name: snakeName,
					score: 0,
					goalScore: 10,
				},
				stored,
		  )
}

const updatePlayersFromConnections = (
	{ players, food },
	{ connections, disconnections },
	imageQueue,
) => {
	if (connections.length === 0 && disconnections.length === 0) return players

	let allPos = getAllOccupiedPositions({ players, food })

	let randomKey = getRandomKey()
	while (allPos.includes(randomKey)) {
		randomKey = getRandomKey()
	}

	let updatedPlayers = R.reduce(
		addId(randomKey, imageQueue),
		R.reduce(removeId, players, disconnections),
		connections,
	)

	// clear connections
	connections.splice(0)
	disconnections.splice(0)

	return updatedPlayers
}

module.exports = updatePlayersFromConnections
