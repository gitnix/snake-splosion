module.exports = {
	BACKGROUNDS: ['sand', 'calm_sand', 'gray_sand', 'night_sand'],
	APPLE_SCORE: 10,
	CHEESE_CHANCE: 0.35,
	CHEESE_SCORE: -10,
	COLORS: ['GREEN', 'BLUE', 'PINK', 'GOLD'],
	DEATH_TICKS: 2,
	DIRECTIONS: ['RIGHT', 'LEFT', 'UP', 'DOWN'],
	GOAL_SCORE: 100,
	GRID_COLUMNS: 50,
	GRID_ROWS: 30,
	LOOP_REPEAT_INTERVAL: 80,
	// total mines on field can actually exceed this
	// depending on mine spawn settings
	MAX_MINES: 25,
	MAX_PLAYERS: 4,
	// Actual distance for directly north, south, east, west
	// will be this number plus 1
	MINE_SPAWN_DISTANCE: 7,
	MOUSE_SCORE: 30,
	NEW_BODY_LENGTH: 6,
	SNAKE_LOADING_IMAGE: 'images/venomous_brown_tree_snake.jpg',
	TICKS_UNTIL_RESET: 90,
	// mines to destory: number of current mines / TRIGGER_DIVISOR
	TRIGGER_DIVISOR: 3,
	WS_ACTIVITY_TIMEOUT: 1000,
	WS_SPECTATING_ACTIVITY_TIMEOUT: 2000,
}
