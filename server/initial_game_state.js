const { TICKS_UNTIL_RESET } = require('./constants')

module.exports = {
	players: [],
	food: { '15_15': { score: 10 }, '3_3': { score: 10 } },
	mines: {},
	markedMines: [],
	triggers: { '12_12': { isCollided: false } },
	mineState: {
		turnCounter: 0,
		minesToAdd: 2,
		turnToAdd: 1,
		mineMultiplier: 1,
	},
	gameInfo: {
		winner: null,
		ticksUntilReset: TICKS_UNTIL_RESET,
		maxTicksUntilReset: TICKS_UNTIL_RESET,
	},
}
