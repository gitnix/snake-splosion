const { compose, assoc, dissoc, filter, reduce } = require('ramda')
const { getValidRandomKey, getAllOccupiedPositions } = require('../../utils')

const updateFoodPositions = ({ players, food }) => {
	const allMarkedFood = filter(f => !!food[f].isCollided)(Object.keys(food))

	const allPos = getAllOccupiedPositions({ players, food }) // mutable

	const updatedFood = reduce(
		(foodObj, foodKey) => {
			const randomKey = getValidRandomKey(allPos)
			allPos.push(randomKey)
			return compose(assoc(randomKey, { score: 5 }), dissoc(foodKey))(foodObj)
		},
		food,
		allMarkedFood,
	)

	return {
		players,
		food: updatedFood,
	}
}

module.exports = updateFoodPositions
