const gameOptions = require('./constants')
const initialState = require('./initial_game_state')

const chatSetOption = (option, value) => {
	switch (option) {
		case 'score':
			if (value <= 10 || value >= 800) return false
			gameOptions.GOAL_SCORE = value
			break

		case 'maxMines':
			if (value < 10 || value > 500) return false
			gameOptions.MAX_MINES = value
			break

		case 'mineSpawnDistance':
			if (value < 1 || value > 9) return false
			gameOptions.MINE_SPAWN_DISTANCE = value
			break

		case 'trigger':
			if (value < 1 || value > 10) return false
			gameOptions.TRIGGER_DIVISOR = value
			break

		case 'minesToAdd':
			if (value < 1 || value > 50) return false
			initialState.mineState.minesToAdd = value
			break

		case 'turnToAdd':
			if (value < 1 || value > 20) return false
			initialState.mineState.turnToAdd = value
			break

		case 'default':
			if (value !== 1) return false
			gameOptions.GOAL_SCORE = 150
			gameOptions.MAX_MINES = 40
			gameOptions.MINE_SPAWN_DISTANCE = 2
			gameOptions.TRIGGER_DIVISOR = 3
			initialState.mineState.minesToAdd = 1
			initialState.mineState.turnToAdd = 1
			break

		default:
			return false
	}
	console.log(`option ${option} was changed to ${value}`)
	return true
}

const chatHelp = () => {
	return `FORMAT: set option integer
	EXAMPLE: set score 200
	OPTIONS:
	score,
	maxMines,
	mineSpawnDistance (distance in front of player is 1 + this number),
	trigger (mines to destory: number of current mines / trigger),
	minesToAdd (how many mines to add on eat),
	turnToAdd (how many apples eaten until new mines added)

	to reset to default use set default 1
	DEFAULT VALUES ARE:
	score: 150
	maxMines: 40
	mineSpawnDistance: 2
	trigger: 3
	minesToAdd: 1
	turnToAdd: 1`
}

module.exports = {
	chatHelp,
	chatSetOption,
}
