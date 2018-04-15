rankings = [p1_id, p3_id, etc]

players = [
	{
		id: 'someId',
		body: ['X_Y', 'X_Y'],
		state: 'normal' | 'dead',
		goalScore: 10,
		score: 0,
	},
]

food = {
	X_Y: {
		score: 5,
		hasBeenCollided: true,
	},
}

mines = {
	X_Y: {
		explosionRadius: 0,
		hasBeenCollided: true,
	},
}

mineMods = {
	// every time apple is eaten increase counter - use counter mod mineModulus to get turns
	// where new mines are created
	turnCounter: 1,

	// value that will increment based on MINE_MULTIPLIER
	// if value is 1 and MINE_MULTIPLIER is 2 numMinesToAdd will be 1,3,5...etc
	numMinesToAdd: 1,

	// turn on which new mines are created
	mineModulus: 2,

	// how much the number of mines will increase
	MINE_MULTIPLIER: 1,
}
