const { getAllPlayerPositions } = require('../../utils')

const processPlayerCollisions = state => {
	const { players } = state

	const markedPlayers = players.map(player => {
		const self = players.filter(p => p.id === player.id)
		const others = players.filter(p => p.id !== player.id)
		// doesn't include head
		const selfPositions = getAllPlayerPositions(self).slice(1)
		const otherPositions = getAllPlayerPositions(others)

		const head = player.body[0]
		const isCollided =
			player.state === 'readyToMove' ||
			player.state === 'frozen' ||
			player.state === 'teleportReady'
				? false
				: selfPositions.concat(otherPositions).includes(head)

		return {
			...player,
			state: isCollided ? 'dead' : player.state,
			deathCause: isCollided ? 'body' : player.deathCause,
		}
	})

	return {
		...state,
		players: markedPlayers,
	}
}

module.exports = processPlayerCollisions
