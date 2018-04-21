const { clientSearchEngineKey, apiKey } = require('./keys')
const GoogleImages = require('google-images')
const client = new GoogleImages(clientSearchEngineKey, apiKey)

let getImage = async snakeName => {
	try {
		// let snakeImages = await client.search(snakeName)
		// let snakeImage = snakeImages[0].url
		// return snakeImage

		// hard code for development
		return 'venomous_brown_tree_snake.jpg'
	} catch (e) {
		console.log(e)
		throw e
	}
}

module.exports = getImage
