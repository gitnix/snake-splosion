const LEFT = ['ArrowLeft', 'a']
const RIGHT = ['ArrowRight', 'd']
const UP = ['ArrowUp', 'w']
const DOWN = ['ArrowDown', 's']

// [direction, opposites]
const keyMap = {
	ArrowLeft: ['LEFT', RIGHT],
	ArrowRight: ['RIGHT', LEFT],
	ArrowUp: ['UP', DOWN],
	ArrowDown: ['DOWN', UP],
	a: ['LEFT', RIGHT],
	d: ['RIGHT', LEFT],
	w: ['UP', DOWN],
	s: ['DOWN', UP],
}

const areOpposites = (curr, last) => keyMap[last][1].includes(curr)
const has = key => !!keyMap[key]
const toDirection = key => keyMap[key][0]

export default {
	areOpposites,
	has,
	toDirection,
}
