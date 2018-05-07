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

const roundRect = (ctx, x, y, w, h, r) => {
	if (w < 2 * r) r = w / 2
	if (h < 2 * r) r = h / 2
	ctx.beginPath()
	ctx.moveTo(x + r, y)
	ctx.arcTo(x + w, y, x + w, y + h, r)
	ctx.arcTo(x + w, y + h, x, y + h, r)
	ctx.arcTo(x, y + h, x, y, r)
	ctx.arcTo(x, y, x + w, y, r)
	ctx.closePath()
}

export { getBodyDirection, newImage, roundRect, scale, strToCoords }
