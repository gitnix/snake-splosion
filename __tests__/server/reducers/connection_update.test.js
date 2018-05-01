const connection_update = require('server/reducers/connection_update')
const { newBody } = require('server/utils')
const { DEATH_TICKS, GOAL_SCORE } = require('server/constants')

const mockedKey = '16_2'
const mockedName = 'Viper'
const mockedColor = 'GREEN'

jest.mock('server/get_snake_names', () => () => mockedName)
jest.mock('server/image_search', () => () =>
	Promise.resolve('test_image_url.png'),
)
jest.mock('server/utils', () =>
	Object.assign(require.requireActual('server/utils'), {
		getValidRandomKey: () => mockedKey,
		getRandomColor: () => mockedColor,
	}),
)

describe('reducer - connection update', () => {
	test('players updated with connections', () => {
		const connections = ['p2-id']
		const disconnections = []
		const imageQueue = []
		const state = {
			players: [{ id: 'p1-id' }],
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
			{ id: 'p1-id' },
			{
				body: newBody(mockedKey),
				color: mockedColor,
				deathTicks: DEATH_TICKS,
				goalScore: GOAL_SCORE,
				id: 'p2-id',
				name: mockedName,
				score: 0,
				state: 'normal',
			},
		])
	})

	test('players updated with disconnections', () => {
		const connections = []
		const disconnections = ['p2-id']
		const imageQueue = []
		const state = {
			players: [{ id: 'p1-id' }, { id: 'p2-id' }],
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
		).toEqual([{ id: 'p1-id' }])
	})

	test('return players if no connections or disconnections', () => {
		const connections = []
		const disconnections = []
		const imageQueue = []
		const state = {
			players: [{ id: 'p1-id' }, { id: 'p2-id' }],
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
		).toEqual([{ id: 'p1-id' }, { id: 'p2-id' }])
	})
})
