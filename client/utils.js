import { UNIT_SIZE } from './constants'

const idFor = (id, prop) => document.getElementById(`p${id}-${prop}`)
const updateDOM = (id, prop, value, extra = '') =>
	(idFor(id, prop).innerHTML = value + extra)

const scale = (val = 1) => val * UNIT_SIZE
const strToCoords = key => key.split('_').map(string => parseInt(string))

const getImage = src => {
	const img = new Image(UNIT_SIZE, UNIT_SIZE)
	img.src = src
	return img
}

const noop = () => {}

export { idFor, updateDOM, scale, strToCoords, getImage, noop }
