const { compose } = require('ramda')

// let functionIndex = 0
// const log = value => {
// 	console.log('--------------  ' + (functionIndex % 9) + '  --------------')
// 	console.log(value)
// 	functionIndex = (functionIndex + 1) % 9
// 	return value
// }

const cp_food = require('./collision_process/food')
const cp_mine = require('./collision_process/mine')
const cp_player = require('./collision_process/player')
const cp_trigger = require('./collision_process/triggers')
const cp_mice = require('./collision_process/mice')

const pu_food = require('./position_update/food')
const pu_mine = require('./position_update/mine')
const pu_player = require('./position_update/player')
const pu_trigger = require('./position_update/triggers')
const pu_mice = require('./position_update/mice')

const process_winner = require('./winner')
const move = require('./move')
const connectionUpdate = require('./connection_update')

const reduceState = compose(
	process_winner,
	pu_player,
	cp_player,
	pu_mice,
	cp_mice,
	pu_trigger,
	pu_mine,
	cp_mine,
	cp_trigger,
	pu_food,
	cp_food,
)

// for quick logging purposes

// const reduceState = compose(
// 	log,
// 	process_winner,
// 	log,
// 	pu_player,
// 	log,
// 	cp_player,
// 	log,
// 	pu_trigger,
// 	log,
// 	pu_mine,
// 	log,
// 	cp_mine,
// 	log,
// 	cp_trigger,
// 	log,
// 	pu_food,
// 	log,
// 	cp_food,
// )

module.exports = {
	reduceState,
	move,
	connectionUpdate,
}
