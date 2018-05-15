const { reduce } = require('ramda')

const processTriggerCollisions = state => {
	const { triggers } = state
	const playerHeads = state.players.map(p => p.body[0])

	const updatedTriggers = reduce(
		(triggerObj, triggerKey) => {
			const isCollided = playerHeads.includes(triggerKey)
			return {
				...triggerObj,
				[triggerKey]: {
					isCollided: triggers[triggerKey].isCollided ? true : isCollided,
				},
			}
		},
		triggers,
		Object.keys(triggers),
	)

	return { ...state, triggers: updatedTriggers }
}

module.exports = processTriggerCollisions
