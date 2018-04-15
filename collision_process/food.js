const processFoodCollisions = ({ players, food }) => {
	let newFoodArray = []

	const checkCollision = head => {
		if (food[head]) {
			newFoodArray.push({ [head]: { isCollided: true } })
			return true
		}
		return false
	}

	let markedPlayers = players.map(player => {
		let head = player.body[0]
		let tail = player.body[player.body.length - 1]
		let isCollided = checkCollision(head, food)
		return {
			...player,
			state: isCollided ? 'eating' : player.state,
			score: isCollided ? player.score + food[head].score : player.score,
			body: isCollided ? player.body.concat(tail) : player.body,
		}
	})

	let markedFood = Object.assign({}, food, ...newFoodArray)

	return {
		players: markedPlayers,
		food: markedFood,
	}
}

module.exports = processFoodCollisions
