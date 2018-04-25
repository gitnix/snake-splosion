const processFoodCollisions = ({ players, food }) => {
	const newFoodArray = [] // mutable

	const checkCollision = head => {
		if (food[head]) {
			newFoodArray.push({ [head]: { isCollided: true } })
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

	const markedFood = Object.assign({}, food, ...newFoodArray)

	return {
		players: markedPlayers,
		food: markedFood,
	}
}

module.exports = processFoodCollisions
