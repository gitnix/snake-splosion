const move = require('server/reducers/move')
const { newBody } = require('server/utils')
const {
	DEATH_TICKS,
	GOAL_SCORE,
	GRID_COLUMNS,
	GRID_ROWS,
} = require('server/constants')

const {
	p1_id,
	p1_name,
	p2_id,
	p2_name,
	p3_id,
	p3_name,
	p4_id,
	p4_name,
	server_utils,
	test_color,
} = require('test_constants')

jest.mock('server/utils', () =>
	Object.assign(require.requireActual('server/utils'), {
		getValidRandomKey: () => mockedKey,
	}),
)

const testPlayer = (properties = {}) => {
	return {
		body: ['16_1', '16_2', '16_3'],
		bodyDirections: ['UP', 'UP', 'UP'],
		color: test_color,
		direction: 'RIGHT',
		deathTicks: DEATH_TICKS,
		goalScore: GOAL_SCORE,
		id: p1_id,
		name: p1_name,
		score: 0,
		state: 'normal',
		...properties,
	}
}

describe('reducer - move', () => {
	test('players moved', () => {
		const directionQueue = {
			p1_id: ['LEFT'],
			p2_id: ['UP'],
			p3_id: ['DOWN'],
			p4_id: ['RIGHT'],
		}
		const initialPlayers = [
			testPlayer(),
			testPlayer({
				body: ['3_1', '2_1', '1_1'],
				bodyDirections: ['RIGHT', 'RIGHT', 'RIGHT'],
				id: p2_id,
				name: p2_name,
			}),
			testPlayer({
				body: ['4_1', '5_1', '6_1'],
				bodyDirections: ['LEFT', 'LEFT', 'LEFT'],
				id: p3_id,
				name: p3_name,
			}),
			testPlayer({
				body: ['8_3', '8_2', '8_1'],
				bodyDirections: ['DOWN', 'DOWN', 'DOWN'],
				id: p4_id,
				name: p4_name,
			}),
		]
		expect(
			move(initialPlayers, directionQueue, GRID_COLUMNS, GRID_ROWS),
		).toEqual([
			testPlayer({
				body: ['15_1', '16_1', '16_2'],
				bodyDirections: ['LEFT', 'UP', 'UP'],
				id: p1_id,
				name: p1_name,
				direction: 'LEFT',
			}),
			testPlayer({
				body: ['3_0', '3_1', '2_1'],
				bodyDirections: ['UP', 'RIGHT', 'RIGHT'],
				id: p2_id,
				name: p2_name,
				direction: 'UP',
			}),
			testPlayer({
				body: ['4_2', '4_1', '5_1'],
				bodyDirections: ['DOWN', 'LEFT', 'LEFT'],
				id: p3_id,
				name: p3_name,
				direction: 'DOWN',
			}),
			testPlayer({
				body: ['9_3', '8_3', '8_2'],
				bodyDirections: ['RIGHT', 'DOWN', 'DOWN'],
				id: p4_id,
				name: p4_name,
				direction: 'RIGHT',
			}),
		])
		expect(directionQueue[p1_id]).toEqual(['LEFT'])
		expect(directionQueue[p2_id]).toEqual(['UP'])
		expect(directionQueue[p3_id]).toEqual(['DOWN'])
		expect(directionQueue[p4_id]).toEqual(['RIGHT'])
	})

	test('directionQueue is correctly shifted', () => {
		const directionQueue = { p1_id: ['LEFT', 'RIGHT'] }
		const updatedPlayers = move(
			[testPlayer({ state: 'dead' })],
			directionQueue,
			GRID_COLUMNS,
			GRID_ROWS,
		)
		expect(directionQueue[p1_id]).toEqual(['RIGHT'])
	})

	test('death ticks decrement', () => {
		const directionQueue = { p1_id: ['LEFT'] }
		const updatedPlayers = move(
			[testPlayer({ state: 'dead' })],
			directionQueue,
			GRID_COLUMNS,
			GRID_ROWS,
		)
		expect(updatedPlayers[0].deathTicks).toEqual(DEATH_TICKS - 1)
	})

	test('state: dead, body.length: 0 :::  state: teleportReady, deathTicks: DEATH_TICKS', () => {
		const directionQueue = { p1_id: ['LEFT'] }
		const updatedPlayers = move(
			[testPlayer({ state: 'dead', deathTicks: 0, body: [] })],
			directionQueue,
			GRID_COLUMNS,
			GRID_ROWS,
		)
		expect(updatedPlayers[0].state).toEqual('teleportReady')
		expect(updatedPlayers[0].deathTicks).toEqual(DEATH_TICKS)
	})

	test('body.length: > 0, state: dead, deathTicks: 0, ::: body: sliced body, bodyDirections: sliced bodyDirections, deathTicks: DEATH_TICKS', () => {
		const directionQueue = { p1_id: ['LEFT'] }
		const updatedPlayers = move(
			[testPlayer({ state: 'dead', deathTicks: 0, body: ['1_2', '2_3'] })],
			directionQueue,
			GRID_COLUMNS,
			GRID_ROWS,
		)
		expect(updatedPlayers[0].body).toEqual(['1_2'])
		expect(updatedPlayers[0].bodyDirections).toEqual(['UP', 'UP'])
		expect(updatedPlayers[0].deathTicks).toEqual(DEATH_TICKS)
	})
})
