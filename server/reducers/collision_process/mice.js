const processMiceCollisions = state => {
	const { mice, players } = state
	const playerHeads = players.map(p => p.body[0])
	const mousePositions = mice.map(m => m.body[0])

	const markedMice = mice.map(mouse => {
		return {
			...mouse,
			state: playerHeads.includes(mouse.body[0]) ? 'dead' : mouse.state,
		}
	})

	const markedPlayers = players.map(player => {
		// hard code mouse score for now
		let isCollided = mousePositions.includes(player.body[0])
		return {
			...player,
			state: isCollided ? 'eating' : player.state,
			score: isCollided ? (player.score += 30) : player.score,
		}
	})

	return {
		...state,
		mice: markedMice,
		players: markedPlayers,
	}
}

module.exports = processMiceCollisions
