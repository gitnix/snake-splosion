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

	const markedPlayers = state.players.map(player => {
		const head = player.body[0]
		const isCollided = !!triggers[head]
		return {
			...player,
			state: isCollided ? 'detonating' : player.state,
		}
	})

	return { ...state, triggers: updatedTriggers, players: markedPlayers }
}

module.exports = processTriggerCollisions
