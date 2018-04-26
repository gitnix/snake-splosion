const processFoodCollisions = ({ players, food, mines, mineMods }) => {
	const newFoodArray = [] // mutable
	let mineIncrement = 0

	const checkCollision = head => {
		if (food[head]) {
			newFoodArray.push({ [head]: { isCollided: true } })
			mineIncrement += 1
			console.log(mineIncrement)
			return true
		}
		return false
	}

	const markedPlayers = players.map(player => {
		const head = player.body[0]
		const tail = player.body[player.body.length - 1]
		const isCollided = checkCollision(head, food)
		return {
			...player,
			state: isCollided ? 'eating' : player.state,
			score: isCollided ? player.score + food[head].score : player.score,
			body: isCollided ? player.body.concat(tail) : player.body,
		}
	})

	return {
		players: markedPlayers,
		food: Object.assign({}, food, ...newFoodArray),
		mines,
		mineMods: {
			...mineMods,
			turnCounter: (mineMods.turnCounter += mineIncrement),
		},
	}
}

module.exports = processFoodCollisions
