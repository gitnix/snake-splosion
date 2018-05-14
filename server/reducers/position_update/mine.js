const { MAX_MINES } = require('../../constants')

const { dissoc, filter, gte, merge, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')

const updateMinePositions = ({
	players,
	food,
	mines,
	markedMines,
	mineState,
	gameInfo,
}) => {
	const allPos = getAllOccupiedPositions({ players, food, mines }) // mutable

	const minesAfterExplosions = reduce(
		(mineObj, mineKey) => {
			return dissoc(mineKey)(mineObj)
		},
		mines,
		markedMines,
	)

	const newMines = {} // mutable
	const { turnCounter, turnToAdd } = mineState
	const shouldUpdate = gte(turnCounter, turnToAdd)
	if (shouldUpdate && Object.keys(mines).length < MAX_MINES) {
		let { minesToAdd } = mineState
		while (minesToAdd) {
			const randomKey = getValidRandomKey(allPos, players)
			allPos.push(randomKey)
			newMines[randomKey] = {}
			minesToAdd--
		}
	}

	return {
		players,
		food,
		mines: merge(minesAfterExplosions, newMines),
		markedMines,
		mineState: shouldUpdate ? { ...mineState, turnCounter: 0 } : mineState,
		gameInfo,
	}
}

module.exports = updateMinePositions
