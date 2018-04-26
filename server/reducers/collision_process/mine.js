const processMineCollisions = ({ players, food, mines, mineMods }) => {
	const markedMineArray = [] // mutable

	const checkCollision = head => {
		if (mines[head]) {
			markedMineArray.push({ [head]: { isCollided: true } })
			return true
		}
		return false
	}

	const markedPlayers = players.map(player => {
		const head = player.body[0]
		const tail = player.body[player.body.length - 1]
		const isCollided = checkCollision(head, mines)
		return {
			...player,
			state: isCollided ? 'dead' : player.state,
			score: isCollided ? 0 : player.score,
		}
	})

	return {
		players: markedPlayers,
		food,
		mines: Object.assign({}, mines, ...markedMineArray),
		mineMods,
	}
}

module.exports = processMineCollisions
