const R = require('ramda')
const { getRandomKey, getAllOccupiedPositions } = require('./utils')

let findIndex = (array, currentId) =>
	R.findIndex(element => element.id === currentId)(array)

let removeId = (stored, currentId) => {
	let foundIndex = findIndex(stored, currentId)
	return foundIndex > -1 ? R.remove(foundIndex, 1, stored) : stored
}

let addId = randomKey => (stored, currentId) => {
	let foundIndex = findIndex(stored, currentId)
	return foundIndex > -1
		? stored
		: R.append(
				{
					id: currentId,
					body: [randomKey, randomKey, randomKey],
					state: 'normal',
					score: 0,
					goalScore: 10,
				},
				stored,
		  )
}

const updatePlayersFromConnections = (
	{ players, food },
	{ connections, disconnections },
) => {
	if (connections.length === 0 && disconnections.length === 0) return players

	// let allPos = getPositions({ players, food }).everything
	let allPos = getAllOccupiedPositions({ players, food })

	let randomKey = getRandomKey()
	while (allPos.includes(randomKey)) {
		randomKey = getRandomKey()
	}

	let updatedPlayers = R.reduce(
		addId(randomKey),
		R.reduce(removeId, players, disconnections),
		connections,
	)

	// clear connections
	connections.splice(0)
	disconnections.splice(0)

	return updatedPlayers
}

module.exports = updatePlayersFromConnections
