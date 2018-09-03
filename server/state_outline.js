players = [
	{
		id: 'someId',
		body: ['X_Y', 'X_Y', 'X_Y'],
		// this was added to differentiate particle color
		// maybe implement a different way in the futture
		eatItem: 'CHEESE',
		state:
			'normal' |
			'dead' |
			'reset' |
			'teleportReady' |
			'teleported' |
			'eating' |
			'frozen' |
			'readyToMove',
		// more deathTicks means more ticks will be spent drawing the
		// gray body
		deathTicks: 3,
		// goal score could possibly be different per player to allow
		// handicaps
		goalScore: 10,
		score: 0,
		direction: 'left',
		img: 'imgurl',
		// array is same size as body
		bodyDirections: ['UP', 'RIGHT', 'RIGHT'],
	},
]

mice: [
	{
		id: 'mouse_1',
		body: ['10_10'],
		bodyDirections: ['RIGHT'],
		state: 'normal',
	},
]

food = {
	X_Y: {
		score: 5,
		type: 'APPLE',
		isCollided: true,
	},
}

mines = {
	X_Y: {
		isCollided: true,
	},
}

markedMines = [
	// array of 'X_Y'
]

triggers = {
	X_Y: {
		isCollided: true,
	},
}

mineState = {
	// every time apple is eaten increase counter - use counter mod mineModulus to get turns
	// where new mines are created
	turnCounter: 1,

	// value that will increment based on MINE_MULTIPLIER
	// if value is 1 and MINE_MULTIPLIER is 2 numMinesToAdd will be 1,3,5...etc
	minesToAdd: 1,

	// turn on which new mines are created
	turnToAdd: 2,

	// not implemented
	// how much the number of mines will increase
	mineMultiplier: 1,
}

gameInfo = {
	winner: {
		id: 'someId',
		name: 'snakeName',
	},
	ticksUntilReset: 100,
}
