import { UNIT_SIZE } from './constants'

const newImage = src => {
	const img = new Image(UNIT_SIZE, UNIT_SIZE)
	img.src = src
	return img
}

const scale = (val = 1) => val * UNIT_SIZE

const strToCoords = key => key.split('_').map(string => parseInt(string))

const getTailDirection = (body, defaultDirection) => {
	const tail = body.length - 1
	const preTail = tail - 1

	const [tailX, tailY] = strToCoords(body[tail])
	const [preX, preY] = strToCoords(body[preTail])

	if (preX < tailX) return 'LEFT'
	if (preX > tailX) return 'RIGHT'
	if (preY < tailY) return 'UP'
	if (preY > tailY) return 'DOWN'

	// coords will be same when spawned
	// so draw in player direction
	return defaultDirection
}

export { getTailDirection, newImage, scale, strToCoords }
