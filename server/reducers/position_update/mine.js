const { MAX_MINES } = require('../../constants')

const { dissoc, filter, gte, merge, reduce } = require('ramda')
const {
	getAllOccupiedPositions,
	getValidRandomKey,
	getRandom,
} = require('../../utils')

const updateMinePositions = ({
	players,
	food,
	mines,
	markedMines,
	mineState,
	triggers,
	gameInfo,
}) => {
	const allPos = getAllOccupiedPositions({ players, food, mines }) // mutable

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
		triggers,
		gameInfo,
	}
}

module.exports = updateMinePositions
