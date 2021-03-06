const { NEW_BODY_LENGTH } = require('../../constants')

const {
	getValidRandomKey,
	getAllOccupiedPositions,
	newBody,
} = require('../../utils')

const getStateAfterTeleportingPlayers = state => {
	const { players, food, mines } = state

	const allPos = getAllOccupiedPositions({
		players,
		food,
		mines,
		triggers: state.triggers,
	}) // mutable

	const teleportedPlayers = players.map(player => {
		if (player.state !== 'teleportReady') {
			return player
		}

		const randomKey = getValidRandomKey(allPos)
		return {
			...player,
			body: newBody(randomKey),
			bodyDirections: new Array(NEW_BODY_LENGTH).fill(player.direction),
			state: 'teleported',
			score: 0,
		}
	})

	return {
		...state,
		players: teleportedPlayers,
	}
}

module.exports = getStateAfterTeleportingPlayers
