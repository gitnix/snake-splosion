/* eslint no-unreachable: 0 */
/* eslint no-unused-vars: 0 */

// const { clientSearchEngineKey, apiKey } = require('./keys')
// const GoogleImages = require('google-images')
// const client = new GoogleImages(clientSearchEngineKey, apiKey)
// const { getRandom } = require('./utils')

const getImage = async snakeName => {
	try {
		// const snakeImages = await client.search(snakeName + ' snake')
		// const secureImages = snakeImages.filter(img => img.url.includes('https'))
		// const snakeImage = secureImages[getRandom(secureImages.length)].url
		// // eslint-disable-next-line no-console
		// console.log('fetching snake image ----', snakeImage)
		// return snakeImage

		// hard code for development
		return 'images/venomous_brown_tree_snake.jpg'
	} catch (e) {
		// return backup image
		return 'images/venomous_brown_tree_snake.jpg'
	}
}

module.exports = getImage
