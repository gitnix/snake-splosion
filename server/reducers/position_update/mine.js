const { dissoc, filter, gte, merge, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')

const updateMinePositions = ({ players, food, mines, mineState, gameInfo }) => {
	const allMarkedMines = filter(f => !!mines[f].isCollided)(Object.keys(mines))

	const allPos = getAllOccupiedPositions({ players, food, mines }) // mutable

	const minesAfterExplosions = reduce(
		(mineObj, mineKey) => {
			return dissoc(mineKey)(mineObj)
		},
		mines,
		allMarkedMines,
	)

	const newMines = {} // mutable
	const { turnCounter, turnToAdd } = mineState
	const shouldUpdate = gte(turnCounter, turnToAdd)
	if (shouldUpdate) {
		let { minesToAdd } = mineState
		while (minesToAdd) {
			const randomKey = getValidRandomKey(allPos)
			allPos.push(randomKey)
			newMines[randomKey] = {}
			minesToAdd--
		}
	}

	return {
		players,
		food,
		mines: merge(minesAfterExplosions, newMines),
		mineState: shouldUpdate ? { ...mineState, turnCounter: 0 } : mineState,
		gameInfo,
	}
}

module.exports = updateMinePositions
