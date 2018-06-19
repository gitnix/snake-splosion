const { DEATH_TICKS } = require('../constants')
const { newBodyDirections } = require('../utils')

// accounts for negative modulus
const mod = (n, m) => ((n % m) + m) % m

const move = (playersArray, directionQueue, dimensions, imageMap) => {
	const returnArray = playersArray.map(player => {
		if (player.state === 'teleported') {
			directionQueue[player.id].splice(0) // side effect
			return {
				...player,
				state: 'readyToMove',
			}
		}

		if (
			player.state === 'readyToMove' &&
			directionQueue[player.id].length < 1
		) {
			return {
				...player,
				state: 'readyToMove',
			}
		}

		const direction = directionQueue[player.id][0]

		// make sure there is always a direction to go
		if (directionQueue[player.id].length > 1) {
			directionQueue[player.id].shift() // side effect
		}

		// player is frozen during game over screen
		if (player.state === 'frozen') {
			return player
		}

		// called when reset timer hit 0 and new game is starting
		if (player.state === 'reset') {
			return {
				...player,
				state: 'teleportReady',
				deathTicks: DEATH_TICKS,
			}
		}

		//////////////////////////////////////////
		// dead state
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
				bodyDirections: newBodyDirections(player.bodyDirections, {
					type: 'remove',
				}),
				deathTicks: DEATH_TICKS,
			}
		}
		//////////////////////////////////////////

		return {
			...player,
			body: [
				computeNewHead(player.body[0], direction, dimensions),
				...player.body.slice(0, player.body.length - 1),
			],
			state: player.state === 'connecting' ? 'connected' : 'normal',
			direction,
			img: imageMap.get(player.id),
			bodyDirections:
				player.state !== 'readyToMove'
					? newBodyDirections(player.bodyDirections, {
							type: 'move',
							direction,
					  })
					: player.bodyDirections.map(dir => direction),
		}
	})
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
