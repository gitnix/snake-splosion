import { UNIT_SIZE } from './constants'

const scale = (val = 1) => val * UNIT_SIZE
const strToCoords = key => key.split('_').map(string => parseInt(string))

const newImage = src => {
	const img = new Image(UNIT_SIZE, UNIT_SIZE)
	img.src = src
	return img
}

export { scale, strToCoords, newImage }
