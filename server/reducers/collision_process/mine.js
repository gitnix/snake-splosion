const { getRandom } = require('../../utils')
const gameOptions = require('../../constants')

const processMineCollisions = state => {
	const { players, mice, mines, triggers } = state

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
		const isCollided = checkCollision(head, mines)
		return {
			...player,
			state: isCollided ? 'dead' : player.state,
			score: isCollided ? 0 : player.score,
		}
	})

	const markedMice = mice.map(mouse => {
		const head = mouse.body[0]
		const isCollided = checkCollision(head, mines)
		return {
			...mouse,
			state: isCollided ? 'dead' : mouse.state,
		}
	})

	Object.keys(triggers).forEach(trigger => {
		if (triggers[trigger].isCollided) {
			const allMinePositions = Object.keys(mines)
			const minePositionsSize = allMinePositions.length
			if (minePositionsSize > 0) {
				const numMinesToExplode = Math.floor(
					minePositionsSize / gameOptions.TRIGGER_DIVISOR,
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
		mice: markedMice,
		markedMines: markedMineArray,
	}
}

module.exports = processMineCollisions
