const { compose, assoc, dissoc, filter, reduce } = require('ramda')
const { getValidRandomKey, getAllOccupiedPositions } = require('../../utils')

const updateMinePositions = ({ players, food, mines }) => {
	const allMarkedMines = filter(f => !!mines[f].isCollided)(Object.keys(mines))

	const allPos = getAllOccupiedPositions({ players, food, mines }) // mutable

	const updatedMines = reduce(
		(mineObj, mineKey) => {
			const randomKey = getValidRandomKey(allPos)
			allPos.push(randomKey)
			return compose(
				assoc(randomKey, { hasBeenCollided: false }),
				dissoc(mineKey),
			)(mineObj)
		},
		mines,
		allMarkedMines,
	)

	return {
		players,
		food,
		mines: updatedMines,
	}
}

module.exports = updateMinePositions
