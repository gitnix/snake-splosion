const { clientSearchEngineKey, apiKey } = require('./keys')
const GoogleImages = require('google-images')
const client = new GoogleImages(clientSearchEngineKey, apiKey)

const getImage = async snakeName => {
	try {
		// const snakeImages = await client.search(snakeName)
		// const snakeImage = snakeImages[0].url
		// return snakeImage

		// hard code for development
		return 'images/venomous_brown_tree_snake.jpg'
	} catch (e) {
		console.log(e)
		throw e
	}
}

module.exports = getImage
