const initialState = require('../initial_game_state')
const { TICKS_UNTIL_RESET } = require('../constants')

const processWinner = state => {
	const { gameInfo, players } = state

	if (gameInfo.winner) {
		if (gameInfo.ticksUntilReset <= 0) {
			return {
				...initialState,
				players: players.map(p => ({
					...p,
					score: 0,
					state: 'reset',
					wins: gameInfo.winner.id === p.id ? p.wins + 1 : p.wins,
				})),
				gameInfo: {
					...gameInfo,
					winner: null,
					ticksUntilReset: TICKS_UNTIL_RESET,
				},
			}
		}
		return {
			...state,
			players: players.map(p => ({ ...p, state: 'frozen' })),
			gameInfo: { ...gameInfo, ticksUntilReset: gameInfo.ticksUntilReset - 1 },
		}
	}

	return state
}

module.exports = processWinner
