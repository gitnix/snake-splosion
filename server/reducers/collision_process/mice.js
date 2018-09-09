const { newBodyDirections } = require('../../utils')
const { MOUSE_SCORE } = require('../../constants')

const processMiceCollisions = state => {
	const { mice, players, gameInfo } = state
	const playerHeads = players.map(p => p.body[0])
	const mousePositions = mice.map(m => m.body[0])
	let gameWinner

	const markedMice = mice.map(mouse => {
		return {
			...mouse,
			state: playerHeads.includes(mouse.body[0]) ? 'dead' : mouse.state,
		}
	})

	const markedPlayers = players.map(player => {
		let isCollided = mousePositions.includes(player.body[0])
		let isWinner

		if (isCollided) {
			if (player.score + MOUSE_SCORE >= player.goalScore) {
				isWinner = true
				gameWinner = { id: player.id, name: player.name }
			}
		}

		return {
			...player,
			state: isCollided ? 'eating' : player.state,
			score: isCollided ? (player.score += MOUSE_SCORE) : player.score,
			body: isWinner
				? player.body
				: isCollided
					? player.body.concat(player.body[player.body.length - 1])
					: player.body,
			bodyDirections: isWinner
				? player.bodyDirections
				: isCollided
					? newBodyDirections(player.bodyDirections, {
							type: 'add',
							direction: player.bodyDirections[player.body.length - 1],
					  })
					: player.bodyDirections,
		}
	})

	return {
		...state,
		mice: markedMice,
		players: markedPlayers,
		gameInfo: gameWinner ? { ...gameInfo, winner: gameWinner } : gameInfo,
	}
}

module.exports = processMiceCollisions
