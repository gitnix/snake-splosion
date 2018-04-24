const {
	getValidRandomKey,
	getAllOccupiedPositions,
	newBody,
} = require('../utils')

const getStateAfterTeleportingPlayers = ({ players, food }) => {
	let allPos = getAllOccupiedPositions({ players, food })

	let teleportedPlayers = players.map(player => {
		if (player.state !== 'teleportReady') {
			return player
		}

		let randomKey = getValidRandomKey(allPos)
		return {
			...player,
			body: newBody(randomKey),
			// for future use
			state: 'teleported',
		}
		allPos.push(randomKey)
	})

	return {
		players: teleportedPlayers,
		food,
	}
}

module.exports = getStateAfterTeleportingPlayers
