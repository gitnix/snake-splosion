const processMineCollisions = ({ players, food, mines }) => {
	const newMineArray = [] // mutable

	const checkCollision = head => {
		if (mines[head]) {
			newMineArray.push({ [head]: { isCollided: true } })
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

	const markedMines = Object.assign({}, mines, ...newMineArray)

	return {
		players: markedPlayers,
		food,
		mines: markedMines,
	}
}

module.exports = processMineCollisions
