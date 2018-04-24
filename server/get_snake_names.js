const fs = require('fs')

const snakeNames = fs
	.readFileSync(__dirname + '/snake_names.txt', { encoding: 'utf8' })
	.split('\n')

const getRandomIndex = size => {
	return Math.floor(Math.random() * size)
}

const getRandomSnakeName = () => {
	return snakeNames[getRandomIndex(snakeNames.length - 1)]
}

module.exports = getRandomSnakeName
