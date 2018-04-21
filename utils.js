const { gridSize, possibleDirections } = require('./constants')
const R = require('ramda')

const getRandom = () => Math.floor(Math.random() * gridSize)
const getRandomKey = () => '' + getRandom() + '_' + getRandom()
const getValidRandomKey = array => {
	let randomKey = getRandomKey()
	while (array.includes(randomKey)) {
		randomKey = getRandomKey()
	}
	return randomKey
}

const getAllFoodPositions = food => Object.keys(food)
const getAllPlayerPositions = players => R.chain(player => player.body, players)
const getAllOccupiedPositions = ({ players, food }) =>
	R.concat(getAllPlayerPositions(players), getAllFoodPositions(food))

const getRandomDirection = () =>
	possibleDirections[
		Math.round(Math.random() * (possibleDirections.length - 1))
	]

module.exports = {
	getValidRandomKey,
	getAllFoodPositions,
	getAllPlayerPositions,
	getAllOccupiedPositions,
	getRandomDirection,
}
