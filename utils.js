const { gridSize, possibleDirections } = require('./constants')
const R = require('ramda')

const getRandom = () => Math.round(Math.random() * gridSize)
const getRandomKey = () => '' + getRandom() + '_' + getRandom()

// bring back if needed
// const getPositions = ({ players, food }) => {
// 	let allPlayers = R.chain(player => player.body)(players)
// 	let allFood = Object.keys(food)
// 	let all = R.concat(allPlayers, allFood)
// 	return {
// 		players: allPlayers,
// 		food: allFood,
// 		everything: all,
// 	}
// }

const getAllOccupiedPositions = ({ players, food }) =>
	R.concat(R.chain(player => player.body, players), Object.keys(food))

const getRandomDirection = () =>
	possibleDirections[
		Math.round(Math.random() * (possibleDirections.length - 1))
	]

module.exports = {
	getRandomKey,
	getAllOccupiedPositions,
	getRandomDirection,
}
