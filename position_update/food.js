const R = require('ramda')
const { getRandomKey, getAllOccupiedPositions } = require('../utils')

const updateFoodPositions = ({ players, food }) => {
	let allMarkedFood = R.filter(f => !!food[f].isCollided)(Object.keys(food))
	let allPos = getAllOccupiedPositions({ players, food })

	let updatedFood = allMarkedFood.reduce((foodObj, foodKey) => {
		let randomKey = getRandomKey()
		while (allPos.includes(randomKey)) {
			randomKey = getRandomKey()
		}
		let newFood = R.dissoc(foodKey, foodObj)
		newFood[randomKey] = { score: 5 }
		allPos.push(randomKey)
		return newFood
	}, food)

	return {
		players,
		food: updatedFood,
	}
}

module.exports = updateFoodPositions
