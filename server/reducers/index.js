const { compose } = require('ramda')

const cp_food = require('./collision_process/food')
const cp_player = require('./collision_process/player')

const pu_food = require('./position_update/food')
const pu_player = require('./position_update/player')

const reduceState = compose(pu_player, cp_player, pu_food, cp_food)

const move = require('./move')
const connectionUpdate = require('./updatePlayersFromConnections')

module.exports = {
	reduceState,
	move,
	connectionUpdate,
}
