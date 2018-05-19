const { assoc, compose, dissoc, filter, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')

const updateTriggerPositions = state => {
	const { players, food, mines, triggers } = state

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
		...state,
		triggers: updatedTriggers,
	}
}

module.exports = updateTriggerPositions
