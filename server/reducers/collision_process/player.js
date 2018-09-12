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
		const ignoreCollision = ['readyToMove', 'frozen', 'teleportReady'].includes(
			player.state,
		)

		const isCollidedSelf = ignoreCollision
			? false
			: selfPositions.includes(head)

		const isCollidedOther = ignoreCollision
			? false
			: otherPositions.includes(head)

		const isCollided = isCollidedSelf || isCollidedOther

		const deathCause = () => {
			if (isCollidedSelf) return 'self'
			if (isCollidedOther) return 'other'
			return player.deathCause
		}

		return {
			...player,
			state: isCollided ? 'dead' : player.state,
			deathCause: deathCause(),
		}
	})

	return {
		...state,
		players: markedPlayers,
	}
}

module.exports = processPlayerCollisions
