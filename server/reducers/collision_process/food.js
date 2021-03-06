const { newBodyDirections } = require('../../utils')
const { clamp } = require('ramda')

const processFoodCollisions = state => {
	const { players, mice, food, mineState, gameInfo } = state

	const newFood = {} // mutable
	let mineIncrement = 0
	let gameWinner

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

	const markedMice = mice.map(mouse => {
		const isCollided = checkForCollision(mouse.body[0])
		return {
			...mouse,
			state: isCollided ? 'eating' : mouse.state,
		}
	})

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
			eatItem: isCollided ? food[head].type : player.eatItem,
			score: isCollided
				? clamp(0, Infinity, player.score + food[head].score)
				: player.score,
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
							direction: player.bodyDirections[tail],
					  })
					: player.bodyDirections,
		}
	})
	return {
		...state,
		players: markedPlayers,
		mice: markedMice,
		food: { ...food, ...newFood },
		mineState: {
			...mineState,
			turnCounter: (mineState.turnCounter += mineIncrement),
		},
		gameInfo: gameWinner ? { ...gameInfo, winner: gameWinner } : gameInfo,
	}
}

module.exports = processFoodCollisions
