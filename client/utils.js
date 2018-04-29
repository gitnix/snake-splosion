import { UNIT_SIZE } from './constants'

const newImage = src => {
	const img = new Image(UNIT_SIZE, UNIT_SIZE)
	img.src = src
	return img
}

const scale = (val = 1) => val * UNIT_SIZE

const strToCoords = key => key.split('_').map(string => parseInt(string))

const getTailDirection = (body, defaultDirection, cols, rows) => {
	const tail = body.length - 1
	const preTail = tail - 1

	const xMax = cols - 1
	const yMax = rows - 1

	// coords will be same when spawned
	// so draw in player direction
	if (body[tail] === body[preTail]) return defaultDirection

	const [tailX, tailY] = strToCoords(body[tail])
	const [preX, preY] = strToCoords(body[preTail])

	// PRE - BOTTOM RIGHT
	if (preX === xMax && preY === yMax) {
		if (tailX === 0 && tailY === yMax) return 'LEFT'
		if (tailX === xMax && tailY === 0) return 'UP'
	}

	// PRE - TOP RIGHT
	if (preX === xMax && preY === 0) {
		if (tailX === 0 && tailY === 0) return 'LEFT'
		if (tailX === xMax && tailY === yMax) return 'DOWN'
	}

	// PRE - TOP LEFT
	if (preX === 0 && preY === 0) {
		if (tailX === 0 && tailY === yMax) return 'DOWN'
		if (tailX === xMax && tailY === 0) return 'RIGHT'
	}

	// PRE - BOTTOM LEFT
	if (preX === 0 && preY === yMax) {
		if (tailX === 0 && tailY === 0) return 'UP'
		if (tailX === xMax && tailY === yMax) return 'RIGHT'
	}

	// PRE - TOP  TAIL - BOTTOM
	if (preY === 0 && tailY === yMax) return 'DOWN'
	// PRE - BOTTOM  TAIL - TOP
	if (preY === yMax && tailY === 0) return 'UP'
	// PRE - LEFT  TAIL - RIGHT
	if (preX === 0 && tailX === xMax) return 'RIGHT'
	// PRE - RIGHT  TAIL - LEFT
	if (preX === xMax && tailX === 0) return 'LEFT'

	if (preX < tailX) return 'LEFT'
	if (preX > tailX) return 'RIGHT'
	if (preY < tailY) return 'UP'
	if (preY > tailY) return 'DOWN'

	return defaultDirection
}

const bevelMap = {
	DOWN_RIGHT: 'NE',
	LEFT_UP: 'NE',
	UP_LEFT: 'SW',
	RIGHT_DOWN: 'SW',
	UP_RIGHT: 'SE',
	LEFT_DOWN: 'SE',
	DOWN_LEFT: 'NW',
	RIGHT_UP: 'NW',
}

const getBodyDirection = (bodyDirections, index) => {
	if (!bodyDirections) return 'CENTER'
	const prevDir = bodyDirections[index - 1]
	const dir = bodyDirections[index]
	const bevel = bevelMap[`${prevDir}_${dir}`]
	return bevel ? bevel : 'CENTER'
}

export { getBodyDirection, getTailDirection, newImage, scale, strToCoords }
