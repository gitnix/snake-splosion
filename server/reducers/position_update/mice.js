const {
	keysForTypes,
	strToCoords,
	getValidRandomKey,
	getAllOccupiedPositions,
} = require('../../utils')
const { directionQueue } = require('../../server_state')
const { GRID_COLUMNS, GRID_ROWS } = require('../../constants')
const uuid = require('uuid')

const updateMice = state => {
	const cheeseCount = keysForTypes(state.food, ['CHEESE']).length
	const validMice = []
	const allPos = getAllOccupiedPositions({
		players: state.players,
		food: state.food,
		mines: state.mines,
		triggers: state.triggers,
	})

	state.mice.forEach(mouse => {
		const [x, y] = strToCoords(mouse.body[0])
		// if there is no cheese and the mouse goes out
		// of bounds, discard it
		// if the mouse state is dead, discard it
		if (cheeseCount < 1) {
			if (x === 0 || x === GRID_COLUMNS - 1 || y === 0 || y === GRID_ROWS - 1) {
				// do not validate these mice
			} else {
				if (mouse.state !== 'dead') validMice.push(mouse)
			}
		} else {
			if (mouse.state !== 'dead') {
				validMice.push(mouse)
			}
		}
	})

	if (cheeseCount > state.mice.length) {
		const newId = `mouse_${uuid.v4()}`
		const randomRow = Math.random() > 0.5 ? true : false
		validMice.push({
			id: newId,
			body: [
				// for now mice only spawn on left or top side
				randomRow
					? getValidRandomKey(allPos, null, 0, GRID_ROWS)
					: getValidRandomKey(allPos, null, GRID_COLUMNS, 0),
			],
			bodyDirections: ['RIGHT'],
			state: 'spawned',
		})
		directionQueue[newId] = ['RIGHT']
	}

	return {
		...state,
		mice: validMice,
	}
}

module.exports = updateMice
