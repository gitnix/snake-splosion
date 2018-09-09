const gameOptions = require('./constants')
const initialState = require('./initial_game_state')

const DEFAULT_VALUES = {
	GOAL_SCORE: 100,
	MAX_MINES: 25,
	MINE_SPAWN_DISTANCE: 7,
	TRIGGER_DIVISOR: 3,
	MINES_TO_ADD: 4,
	TURN_TO_ADD: 1,
}

const OUT_OF_RANGE = 'Requested value out of accepted range'
const NOT_A_NUMBER = 'Requested value is not a number'

const chatSetOption = (option, value) => {
	const SUCCESS_MESSAGE = `
	option ${option}
	was changed to:
	${value}
	All players must leave the game
	for the new values to take effect
	`
	switch (option) {
		case 'score':
			if (isNaN(value)) return NOT_A_NUMBER
			if (value <= 10 || value >= 800) return OUT_OF_RANGE
			gameOptions.GOAL_SCORE = value
			return SUCCESS_MESSAGE

		case 'maxMines':
			if (isNaN(value)) return NOT_A_NUMBER

			if (value < 10 || value > 500) return OUT_OF_RANGE
			gameOptions.MAX_MINES = value
			return SUCCESS_MESSAGE

		case 'mineSpawnDistance':
			if (isNaN(value)) return NOT_A_NUMBER
			if (value < 1 || value > 9) return OUT_OF_RANGE
			gameOptions.MINE_SPAWN_DISTANCE = value
			return SUCCESS_MESSAGE

		case 'detonator':
			if (isNaN(value)) return NOT_A_NUMBER
			if (value < 1 || value > 10) return OUT_OF_RANGE
			gameOptions.TRIGGER_DIVISOR = value
			return SUCCESS_MESSAGE

		case 'minesToAdd':
			if (isNaN(value)) return NOT_A_NUMBER
			if (value < 1 || value > 50) return OUT_OF_RANGE
			initialState.mineState.minesToAdd = value
			return SUCCESS_MESSAGE

		case 'turnToAdd':
			if (isNaN(value)) return NOT_A_NUMBER
			if (value < 1 || value > 20) return OUT_OF_RANGE
			initialState.mineState.turnToAdd = value
			return SUCCESS_MESSAGE
	}
	console.log(`option ${option} was changed to ${value}`)
	return 'Unrecognized Option'
}

const chatHelp = () => {
	return `
	COMMANDS
	-------------------------------
	-------------------------------
	Set Option
	-------------------------------
	FORMAT: set option integer

	EXAMPLE: set score 200

	OPTIONS:

	score (game will end once a player reaches this score),

	maxMines (once this number is reached (or exceeded), new mines will not spawn,

	mineSpawnDistance (mines can not spawn more than this distance + 1 in front of players),

	detonator (mines to destory: number of current mines / detonator) (lower means more mines are destroyed),

	minesToAdd (how many mines will be spawned when a player eats),

	turnToAdd (how many apples eaten until new mines added)

	-------------------------------
	List Values
	-------------------------------
	FORMAT: list values

	list the current
	option values

	-------------------------------
	Reset Option Values
	-------------------------------
	FORMAT: set defaults

	sets all option
	values to default

	DEFAULT VALUES ARE:
	score: ${DEFAULT_VALUES.GOAL_SCORE}
	maxMines: ${DEFAULT_VALUES.MAX_MINES}
	mineSpawnDistance: ${DEFAULT_VALUES.MINE_SPAWN_DISTANCE}
	detonator: ${DEFAULT_VALUES.TRIGGER_DIVISOR}
	minesToAdd: ${DEFAULT_VALUES.MINES_TO_ADD}
	turnToAdd: ${DEFAULT_VALUES.TURN_TO_ADD}`
}

const chatSetDefaults = () => {
	gameOptions.GOAL_SCORE = DEFAULT_VALUES.GOAL_SCORE
	gameOptions.MAX_MINES = DEFAULT_VALUES.MAX_MINES
	gameOptions.MINE_SPAWN_DISTANCE = DEFAULT_VALUES.MINE_SPAWN_DISTANCE
	gameOptions.TRIGGER_DIVISOR = DEFAULT_VALUES.TRIGGER_DIVISOR
	initialState.mineState.minesToAdd = DEFAULT_VALUES.MINES_TO_ADD
	initialState.mineState.turnToAdd = DEFAULT_VALUES.TURN_TO_ADD
	console.log('option values set to default')
	return `
	Options set to default
	All players must
	leave the game
	for the new values
	to take effect
	`
}

const chatListOptions = () => {
	return `
	---------------------------------------
	CURRENT OPTION VALUES
	---------------------------------------
	score: ${gameOptions.GOAL_SCORE},
	maxMines: ${gameOptions.MAX_MINES},
	mineSpawnDistance: ${gameOptions.MINE_SPAWN_DISTANCE}
	detonator: ${gameOptions.TRIGGER_DIVISOR}
	minesToAdd: ${initialState.mineState.minesToAdd}
	turnToAdd ${initialState.mineState.turnToAdd}
	`
}

module.exports = {
	chatHelp,
	chatSetOption,
	chatSetDefaults,
	chatListOptions,
}
