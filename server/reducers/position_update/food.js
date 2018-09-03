const { assoc, compose, dissoc, filter, reduce } = require('ramda')
const { getAllOccupiedPositions, getValidRandomKey } = require('../../utils')
const { CHEESE_CHANCE } = require('../../constants')

const updateFoodPositions = state => {
	const { players, mice, food, mines } = state

	const allMarkedFood = filter(f => !!food[f].isCollided)(Object.keys(food))

	const allPos = getAllOccupiedPositions({
		players,
		mice,
		food,
		mines,
		triggers: state.triggers,
	}) // mutable

	const updatedFood = reduce(
		(foodObj, foodKey) => {
			const randomKey = getValidRandomKey(allPos)
			const foodType = Math.random() < CHEESE_CHANCE ? 'CHEESE' : 'APPLE'
			allPos.push(randomKey)
			return compose(
				assoc(randomKey, {
					score: foodType === 'APPLE' ? 10 : 0,
					type: foodType,
				}),
				dissoc(foodKey),
			)(foodObj)
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
