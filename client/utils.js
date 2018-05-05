import { UNIT_SIZE } from './constants'

const newImage = src => {
	const img = new Image(UNIT_SIZE, UNIT_SIZE)
	img.src = src
	return img
}

const scale = (val = 1) => val * UNIT_SIZE

const strToCoords = key => key.split('_').map(string => parseInt(string))

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

export { getBodyDirection, newImage, scale, strToCoords }
