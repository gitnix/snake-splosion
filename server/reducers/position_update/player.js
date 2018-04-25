const {
	getValidRandomKey,
	getAllOccupiedPositions,
	newBody,
} = require('../../utils')

const getStateAfterTeleportingPlayers = ({ players, food }) => {
	const allPos = getAllOccupiedPositions({ players, food }) // mutable

	const teleportedPlayers = players.map(player => {
		if (player.state !== 'teleportReady') {
			return player
		}

		const randomKey = getValidRandomKey(allPos)
		return {
			...player,
			body: newBody(randomKey),
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
