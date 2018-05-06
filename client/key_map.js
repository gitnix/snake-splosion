const LEFT = ['ArrowLeft', 'a', 'j']
const RIGHT = ['ArrowRight', 'd', 'l']
const UP = ['ArrowUp', 'w', 'i']
const DOWN = ['ArrowDown', 's', 'k']

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
	j: ['LEFT', RIGHT],
	l: ['RIGHT', LEFT],
	i: ['UP', DOWN],
	k: ['DOWN', UP],
}

const areOpposites = (curr, last) => keyMap[last][1].includes(curr)
const has = key => !!keyMap[key]
const toDirection = key => keyMap[key][0]

export default {
	areOpposites,
	has,
	toDirection,
}
