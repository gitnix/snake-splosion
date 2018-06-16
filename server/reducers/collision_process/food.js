const { newBodyDirections } = require('../../utils')

const processFoodCollisions = state => {
	const { players, food, mineState, gameInfo } = state

	const newFood = {} // mutable
	let mineIncrement = 0
	let gameWinner = null

	const checkForCollision = head => {
		if (food[head]) {
			if (!newFood[head]) {
				newFood[head] = { ...food[head], isCollided: true }
				mineIncrement += 1
			}
			return true
		}
		return false
	}

	const checkForWinner = player => {
		const head = player.body[0]
		if (checkForCollision(head)) {
			if (player.score + food[head].score >= player.goalScore) {
				gameWinner = { id: player.id, name: player.name }
				return true
			}
			return false
		}
		return player.isWinner
	}

	const markedPlayers = players.map(player => {
		const head = player.body[0]
		const tail = player.body[player.body.length - 1]
		const isCollided = checkForCollision(head)
		const isWinner = checkForWinner(player)
		return {
			...player,
			state: isCollided ? 'eating' : player.state,
			score: isCollided ? player.score + food[head].score : player.score,
			isWinner,
			body: isWinner
				? player.body
				: isCollided
					? player.body.concat(tail)
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
		players: markedPlayers,
		food: { ...food, ...newFood },
		mineState: {
			...mineState,
			turnCounter: (mineState.turnCounter += mineIncrement),
		},
		gameInfo: !!gameWinner ? { ...gameInfo, winner: gameWinner } : gameInfo,
	}
}

module.exports = processFoodCollisions
