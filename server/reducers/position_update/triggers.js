const { assoc, compose, dissoc, filter, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')

const updateTriggerPositions = ({
	players,
	food,
	mines,
	markedMines,
	mineState,
	triggers,
	gameInfo,
}) => {
	const allMarkedTriggers = filter(f => !!triggers[f].isCollided)(
		Object.keys(triggers),
	)

	const allPos = getAllOccupiedPositions({ players, food, mines }) // mutable

	const updatedTriggers = reduce(
		(triggerObj, triggerKey) => {
			const randomKey = getValidRandomKey(allPos)
			allPos.push(randomKey)
			return compose(
				assoc(randomKey, { isCollided: false }),
				dissoc(triggerKey),
			)(triggerObj)
		},
		triggers,
		allMarkedTriggers,
	)

	return {
		players,
		food,
		mines,
		mineState,
		markedMines,
		triggers: updatedTriggers,
		gameInfo,
	}
}

module.exports = updateTriggerPositions
