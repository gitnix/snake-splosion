const { clientSearchEngineKey, apiKey } = require('./keys')
const GoogleImages = require('google-images')
const client = new GoogleImages(clientSearchEngineKey, apiKey)

let getImage = async snakeName => {
	try {
		// let snakeImages = await client.search(snakeName)
		// let snakeImage = snakeImages[0].url
		// return snakeImage

		// resolve for testing
		return Promise.resolve(
			'https://reptilepark.com.au/wp-content/uploads/2015/12/venomous_brown_tree_snake.jpg',
		)
	} catch (e) {
		console.log(e)
		throw e
	}
}

module.exports = getImage
