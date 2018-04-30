const connection_update = require('./connection_update')
const { newBody } = require('../utils')
const { DEATH_TICKS, GOAL_SCORE } = require('../constants')

const mockedKey = '16_2'
const mockedName = 'Viper'
const mockedColor = 'GREEN'

jest.mock('../get_snake_names', () => () => mockedName)
jest.mock('../image_search', () => () => Promise.resolve('test_image_url.png'))
jest.mock('../utils', () =>
	Object.assign(require.requireActual('../utils'), {
		getValidRandomKey: () => mockedKey,
		getRandomColor: () => mockedColor,
	}),
)

describe('reducer - connection', () => {
	test('new player added on connection', () => {
		const connections = ['p1-id']
		const disconnections = []
		const imageQueue = []
		const state = {
			players: [],
			food: {},
			mines: {},
		}
		expect(
			connection_update(
				state,
				{
					connections,
					disconnections,
				},
				imageQueue,
			),
		).toEqual([
			{
				body: newBody(mockedKey),
				color: mockedColor,
				deathTicks: DEATH_TICKS,
				goalScore: GOAL_SCORE,
				id: 'p1-id',
				name: mockedName,
				score: 0,
				state: 'normal',
			},
		])
	})
})
