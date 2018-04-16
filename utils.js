const { gridSize, possibleDirections } = require('./constants')
const R = require('ramda')

const getRandom = () => Math.round(Math.random() * gridSize)
const getRandomKey = () => '' + getRandom() + '_' + getRandom()

const getAllFoodPositions = food => Object.keys(food)
const getAllPlayerPositions = players => R.chain(player => player.body, players)
const getAllOccupiedPositions = ({ players, food }) =>
	R.concat(getAllPlayerPositions(players), getAllFoodPositions(food))

const getRandomDirection = () =>
	possibleDirections[
		Math.round(Math.random() * (possibleDirections.length - 1))
	]

module.exports = {
	getRandomKey,
	getAllFoodPositions,
	getAllPlayerPositions,
	getAllOccupiedPositions,
	getRandomDirection,
}
