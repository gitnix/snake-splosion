const { getAllPlayerPositions, newBodyDirections } = require('../../utils')

const processPlayerCollisions = state => {
	const { players } = state

	const collisionArray = [] //mutable

	const markedPlayers = players.map(player => {
		const self = players.filter(p => p.id === player.id)
		const others = players.filter(p => p.id !== player.id)
		// doesn't include head
		const selfPositions = getAllPlayerPositions(self).slice(1)
		const otherPositions = getAllPlayerPositions(others)

		// ensures head-on collisions handle properly
		// otherwise both players would get head sliced
		// leaving a gap and making it appear as if there
		// wasn't a collision

		const head = player.body[0]
		const isCollided =
			player.state === 'readyToMove' ||
			player.state === 'frozen' ||
			player.state === 'teleportReady'
				? false
				: selfPositions.concat(otherPositions).includes(head)

		if (isCollided) {
			if (collisionArray.includes(player.body[0])) shouldSlice = false
			else collisionArray.push(player.body[0])
		}

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
