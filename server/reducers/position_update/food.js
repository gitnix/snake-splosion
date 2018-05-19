const { assoc, compose, dissoc, filter, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')

const updateFoodPositions = state => {
	const { players, food, mines } = state

	const allMarkedFood = filter(f => !!food[f].isCollided)(Object.keys(food))

	const allPos = getAllOccupiedPositions({ players, food, mines }) // mutable

	const updatedFood = reduce(
		(foodObj, foodKey) => {
			const randomKey = getValidRandomKey(allPos)
			allPos.push(randomKey)
			return compose(assoc(randomKey, { score: 10 }), dissoc(foodKey))(foodObj)
		},
		food,
		allMarkedFood,
	)

	return {
		...state,
		food: updatedFood,
	}
}

module.exports = updateFoodPositions
