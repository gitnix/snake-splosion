const { dissoc, filter, gte, merge, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')

const updateMinePositions = ({ players, food, mines, mineMods }) => {
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
	const { turnCounter, turnToAdd } = mineMods
	const shouldUpdate = gte(turnCounter, turnToAdd)
	if (shouldUpdate) {
		let { minesToAdd } = mineMods
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
		mineMods: shouldUpdate ? { ...mineMods, turnCounter: 0 } : mineMods,
	}
}

module.exports = updateMinePositions
