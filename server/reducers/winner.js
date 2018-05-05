const initialState = require('../initial_game_state')
const { TICKS_UNTIL_RESET } = require('../constants')

const processWinner = ({ players, food, mines, mineState, gameInfo }) => {
	if (gameInfo.winner) {
		if (gameInfo.ticksUntilReset <= 0) {
			return {
				...initialState,
				players: players.map(p => ({ ...p, score: 0, state: 'reset' })),
				gameInfo: { winner: null, ticksUntilReset: TICKS_UNTIL_RESET },
			}
		}
		return {
			players: players.map(p => ({ ...p, state: 'frozen' })),
			food,
			mines,
			mineState,
			gameInfo: { ...gameInfo, ticksUntilReset: gameInfo.ticksUntilReset - 1 },
		}
	}

	return {
		players,
		food,
		mines,
		mineState,
		gameInfo,
	}
}

module.exports = processWinner
