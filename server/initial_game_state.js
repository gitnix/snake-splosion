const { TICKS_UNTIL_RESET } = require('./constants')

module.exports = {
	players: [],
	mice: [],
	food: {
		'15_15': { score: 10, type: 'APPLE' },
		'40_20': { score: 0, type: 'APPLE' },
	},
	mines: {},
	markedMines: [],
	newMines: [],
	triggers: { '12_12': { isCollided: false } },
	mineState: {
		turnCounter: 1,
		minesToAdd: 4,
		turnToAdd: 1,
	},
	gameInfo: {
		winner: null,
		ticksUntilReset: TICKS_UNTIL_RESET,
		maxTicksUntilReset: TICKS_UNTIL_RESET,
	},
}
