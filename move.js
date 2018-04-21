// accounts for negative modulus
const mod = (n, m) => (n % m + m) % m

const move = (playersArray, directionQueue, ...dimensions) => {
	// console.log('playersArray in move', playersArray)
	let returnArray = playersArray.map(player => {
		if (player.state === 'dead') {
			return {
				...player,
				body: player.body.slice(0, player.body.length - 1),
			}
		}
		return {
			...player,
			body: [
				computeNewHead(player.body[0], directionQueue[player.id], dimensions),
				...player.body.slice(0, player.body.length - 1),
			],
		}
	})
	// console.log('returnArray', returnArray)
	return returnArray
}

// side effects: mutates directionQueue
const computeNewHead = (head, directionQueue, [columns, rows]) => {
	const [x, y] = head.split('_').map(string => parseInt(string))

	const getModString = (x, y) => {
		return '' + x + '_' + y
	}

	let direction = directionQueue[0]
	if (typeof direction !== 'string')
		throw 'direction ' + direction + ' is not string'

	// make sure there is always a direction to go
	if (directionQueue.length > 1) {
		directionQueue.shift()
	}

	switch (direction) {
		case 'UP':
			return getModString(x, mod(y - 1, rows))
		case 'DOWN':
			return getModString(x, mod(y + 1, rows))
		case 'LEFT':
			return getModString(mod(x - 1, columns), y)
		case 'RIGHT':
			return getModString(mod(x + 1, columns), y)
	}
}

module.exports = move
