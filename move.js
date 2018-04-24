const { DEATH_TICKS } = require('./constants')

// accounts for negative modulus
const mod = (n, m) => (n % m + m) % m

const move = (playersArray, directionQueue, ...dimensions) => {
	// console.log('playersArray in move', playersArray)
	let returnArray = playersArray.map(player => {
		if (player.state === 'dead') {
			if (player.body.length <= 0) {
				return {
					...player,
					state: 'teleportReady',
					deathTicks: DEATH_TICKS,
				}
			}
			if (player.deathTicks > 0) {
				return {
					...player,
					deathTicks: player.deathTicks - 1,
				}
			}
			return {
				...player,
				body: player.body.slice(0, player.body.length - 1),
				deathTicks: DEATH_TICKS,
			}
		} // end dead

		let direction = directionQueue[player.id][0]
		if (typeof direction !== 'string')
			throw `direction ${direction} is not string`

		// make sure there is always a direction to go
		if (directionQueue[player.id].length > 1) {
			directionQueue[player.id].shift()
		}

		return {
			...player,
			body: [
				computeNewHead(player.body[0], direction, dimensions),
				...player.body.slice(0, player.body.length - 1),
			],
			state: 'normal',
			direction,
		}
	})
	// console.log('returnArray', returnArray)
	return returnArray
}

// side effects: mutates directionQueue
const computeNewHead = (head, direction, [columns, rows]) => {
	const [x, y] = head.split('_').map(string => parseInt(string))

	const getModString = (x, y) => {
		return '' + x + '_' + y
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
