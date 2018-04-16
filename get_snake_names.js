const fs = require('fs')

const snakeNames = fs
	.readFileSync(__dirname + '/snake_names.txt', { encoding: 'utf8' })
	.split('\n')

const getRandomIndex = size => {
	return Math.floor(Math.random() * size)
}

const getRandomSnakeName = () => {
	return allToUpper(snakeNames[getRandomIndex(snakeNames.length - 1)])
}

const allToUpper = str =>
	str
		.split(' ')
		.map(word => word.replace(word[0], word[0].toUpperCase()))
		.join(' ')

module.exports = getRandomSnakeName
