const { DEATH_TICKS } = require('../constants')
const {
	getAllOccupiedPositions,
	keysToString,
	newBodyDirections,
	strToCoords,
} = require('../utils')

// accounts for negative modulus
const mod = (n, m) => ((n % m) + m) % m

const move = (
	players,
	directionQueue,
	dimensions,
	imageMap,
	food,
	mines,
	triggers,
) => {
	const returnArray = players.map(player => {
		if (player.id.split('_')[0] === 'ai') {
			const pushDir = dir => (directionQueue[player.id][0] = dir)
			const tryDirMove = (arr, aiX, aiY, successChance) => {
				if (Math.random() > successChance) {
					return
				}
				if (!arr.includes(keysToString(aiX + 1, aiY))) {
					pushDir('RIGHT')
					return
				}
				if (!arr.includes(keysToString(aiX - 1, aiY))) {
					pushDir('LEFT')
					return
				}
				if (!arr.includes(keysToString(aiX, aiY - 1))) {
					pushDir('UP')
					return
				}
				if (!arr.includes(keysToString(aiX, aiY + 1))) {
					pushDir('DOWN')
					return
				}
				return
			}

			if (player.state !== 'dead' && player.state !== 'readyToMove') {
				const [x, y] = strToCoords(player.body[0])
				let targets = [...Object.keys(food), ...Object.keys(triggers)]
				let targetDistances = targets.map(key => {
					const [tX, tY] = strToCoords(key)
					return {
						key,
						distance: Math.hypot(Math.abs(tX - x), Math.abs(tY - y)),
					}
				})
				targetDistances.sort((a, b) => a.distance - b.distance)

				const [targetX, targetY] = strToCoords(targetDistances[0].key)

				const lastDir = directionQueue[player.id][0]
				const random = Math.random()
				const chanceToContinuePath = 0.85
				const closeInDistance = 5
				const chanceOfSuccess = 0.96
				let xDistance = Math.abs(targetX - x)
				let yDistance = Math.abs(targetY - y)
				const isClose =
					xDistance <= closeInDistance && yDistance <= closeInDistance

				switch (lastDir) {
					case 'UP':
						if (isClose || random > chanceToContinuePath) {
							if (x > targetX) pushDir('LEFT')
							else pushDir('RIGHT')
						}
						break

					case 'DOWN':
						if (isClose || random > chanceToContinuePath) {
							if (x > targetX) pushDir('LEFT')
							else pushDir('RIGHT')
						}
						break

					case 'RIGHT':
						if (isClose || random > chanceToContinuePath) {
							if (y > targetY) pushDir('UP')
							else pushDir('DOWN')
						}
						break

					case 'LEFT':
						if (isClose || random > chanceToContinuePath) {
							if (y > targetY) pushDir('UP')
							else pushDir('DOWN')
						}
						break
				}

				const qIndex = directionQueue[player.id].length - 1
				const allPos = getAllOccupiedPositions({ players, mines, food: {} })
				const adjustDir = tryDirMove.bind(null, allPos, x, y, chanceOfSuccess)
				switch (directionQueue[player.id][qIndex]) {
					case 'UP':
						if (allPos.includes(keysToString(x, y - 1))) {
							adjustDir()
							break
						} else {
							directionQueue[player.id][0] = 'UP'
							break
						}

					case 'DOWN':
						if (allPos.includes(keysToString(x, y + 1))) {
							adjustDir()
							break
						} else {
							directionQueue[player.id][0] = 'DOWN'
							break
						}

					case 'RIGHT':
						if (allPos.includes(keysToString(x + 1, y))) {
							adjustDir()
							break
						} else {
							directionQueue[player.id][0] = 'RIGHT'
							break
						}

					case 'LEFT':
						if (allPos.includes(keysToString(x - 1, y))) {
							adjustDir()
							break
						} else {
							directionQueue[player.id][0] = 'LEFT'
							break
						}
				}
			}

			if (player.state === 'readyToMove') {
				pushDir('RIGHT')
			}
		}

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
	// arrange players on left and ai on right
	return returnArray.sort((a, b) => a.ai - b.ai)
}

// side effects: mutates directionQueue
const computeNewHead = (head, direction, [columns, rows]) => {
	const [x, y] = strToCoords(head)

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
