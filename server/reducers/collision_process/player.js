const { getAllPlayerPositions, newBodyDirections } = require('../../utils')

const processPlayerCollisions = ({
	players,
	food,
	mines,
	markedMines,
	mineState,
	gameInfo,
}) => {
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
		let shouldSlice = true

		const head = player.body[0]
		const isCollided =
			player.state === 'readyToMove'
				? false
				: selfPositions.concat(otherPositions).includes(head)

		if (isCollided) {
			if (collisionArray.includes(player.body[0])) shouldSlice = false
			else collisionArray.push(player.body[0])
		}
		return {
			...player,
			state: isCollided ? 'dead' : player.state,
			score: isCollided ? 0 : player.score,
			body: isCollided && shouldSlice ? player.body.slice(1) : player.body,
			bodyDirections:
				isCollided && shouldSlice
					? newBodyDirections(player, { type: 'remove' })
					: player.bodyDirections,
		}
	})

	return {
		players: markedPlayers,
		food,
		mines,
		markedMines,
		mineState,
		gameInfo,
	}
}

module.exports = processPlayerCollisions
