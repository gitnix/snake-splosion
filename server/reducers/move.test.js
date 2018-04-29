const move = require('./move')
const { newBody } = require('../utils')
const {
	DEATH_TICKS,
	GOAL_SCORE,
	GRID_COLUMNS,
	GRID_ROWS,
} = require('../constants')

const mockedKey = '16_2'
const mockedName = 'Viper'

jest.mock('../get_snake_names', () => () => mockedName)
jest.mock('../image_search', () => () => Promise.resolve('test_image_url.png'))
jest.mock('../utils', () =>
	Object.assign(require.requireActual('../utils'), {
		getValidRandomKey: () => mockedKey,
	}),
)

const p1_id = 'p1_id'
const p1_name = 'p1_name'
const p2_id = 'p2_id'
const p2_name = 'p2_name'

describe('reducer - move', () => {
	test('players moved', () => {
		const directionQueue = {
			p1_id: ['LEFT'],
			p2_id: ['UP'],
		}
		const initialPlayers = [
			{
				body: ['16_1', '16_2', '16_3'],
				deathTicks: DEATH_TICKS,
				goalScore: GOAL_SCORE,
				id: p1_id,
				name: p1_name,
				score: 0,
				state: 'normal',
			},
			{
				body: ['3_1', '2_1', '1_1'],
				deathTicks: DEATH_TICKS,
				goalScore: GOAL_SCORE,
				id: p2_id,
				name: p2_name,
				score: 0,
				state: 'normal',
			},
		]
		expect(
			move(initialPlayers, directionQueue, GRID_COLUMNS, GRID_ROWS),
		).toEqual([
			{
				body: ['15_1', '16_1', '16_2'],
				bodyDirections: ['LEFT', 'LEFT', 'LEFT'],
				deathTicks: DEATH_TICKS,
				direction: 'LEFT',
				goalScore: GOAL_SCORE,
				id: p1_id,
				name: p1_name,
				score: 0,
				state: 'normal',
			},
			{
				body: ['3_0', '3_1', '2_1'],
				bodyDirections: ['UP', 'UP', 'UP'],
				deathTicks: DEATH_TICKS,
				direction: 'UP',
				goalScore: GOAL_SCORE,
				id: p2_id,
				name: p2_name,
				score: 0,
				state: 'normal',
			},
		])
	})
})
