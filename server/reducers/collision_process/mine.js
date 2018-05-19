const { getRandom } = require('../../utils')
const { TRIGGER_DIVISOR } = require('../../constants')

const processMineCollisions = state => {
	const { players, mines, triggers } = state

	const markedMineArray = [] // mutable

	const checkCollision = head => {
		if (mines[head]) {
			markedMineArray.push(head)
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

	Object.keys(triggers).forEach(trigger => {
		if (triggers[trigger].isCollided) {
			const allMinePositions = Object.keys(mines)
			const minePositionsSize = allMinePositions.length
			if (minePositionsSize > 0) {
				const numMinesToExplode = Math.floor(
					minePositionsSize / TRIGGER_DIVISOR,
				)
				for (let i = 0; i < numMinesToExplode; i++) {
					markedMineArray.push(
						allMinePositions[getRandom(minePositionsSize - 1)],
					)
				}
			}
		}
	})

	return {
		...state,
		players: markedPlayers,
		markedMines: markedMineArray,
	}
}

module.exports = processMineCollisions
