const { compose } = require('ramda')

const cp_food = require('./collision_process/food')
const cp_mine = require('./collision_process/mine')
const cp_player = require('./collision_process/player')

const pu_food = require('./position_update/food')
const pu_mine = require('./position_update/mine')
const pu_player = require('./position_update/player')

const reduceState = compose(
	pu_player,
	cp_player,
	pu_mine,
	cp_mine,
	pu_food,
	cp_food,
)

const move = require('./move')
const connectionUpdate = require('./connection_update')

module.exports = {
	reduceState,
	move,
	connectionUpdate,
}
