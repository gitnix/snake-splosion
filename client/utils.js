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

const roundRect = (
	ctx,
	x,
	y,
	width,
	height,
	radius = 5,
	fill = true,
	stroke = false,
) => {
	radius = { tl: radius, tr: radius, br: radius, bl: radius }
	ctx.beginPath()
	ctx.moveTo(x + radius.tl, y)
	ctx.lineTo(x + width - radius.tr, y)
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
	ctx.lineTo(x + width, y + height - radius.br)
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
	ctx.lineTo(x + radius.bl, y + height)
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
	ctx.lineTo(x, y + radius.tl)
	ctx.quadraticCurveTo(x, y, x + radius.tl, y)
	ctx.closePath()
	if (fill) {
		ctx.fill()
	}
	if (stroke) {
		ctx.stroke()
	}
}

export { getBodyDirection, newImage, roundRect, scale, strToCoords }
