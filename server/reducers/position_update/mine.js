const gameOptions = require('../../constants')

const { dissoc, filter, gte, merge, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')

const updateMinePositions = state => {
	const { players, food, mines, markedMines, mineState, triggers } = state

	const allPos = getAllOccupiedPositions({ players, food, mines, triggers }) // mutable

	const minesAfterExplosions = reduce(
		(mineObj, mineKey) => {
			if (mineObj[mineKey]) return dissoc(mineKey)(mineObj)
			return mineObj
		},
		mines,
		markedMines,
	)

	const newMines = {} // mutable
	const { turnCounter, turnToAdd } = mineState
	const shouldUpdate = gte(turnCounter, turnToAdd)
	if (shouldUpdate && Object.keys(mines).length < gameOptions.MAX_MINES) {
		let { minesToAdd } = mineState
		while (minesToAdd) {
			const randomKey = getValidRandomKey(allPos, players)
			allPos.push(randomKey)
			newMines[randomKey] = {}
			minesToAdd--
		}
	}

	return {
		...state,
		mines: merge(minesAfterExplosions, newMines),
		newMines,
		mineState: shouldUpdate ? { ...mineState, turnCounter: 0 } : mineState,
	}
}

module.exports = updateMinePositions
