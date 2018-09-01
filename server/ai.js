const { keysToString, strToCoords } = require('./utils')

const pushDir_unbound = (id, directionQueue, dir) =>
	(directionQueue[id][0] = dir)

const tryDirMove = (arr, directionQueue, id, aiX, aiY, successChance) => {
	const pushDir = pushDir_unbound.bind(null, id, directionQueue)

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

const processAiMove = ({
	ai,
	directionQueue,
	targets,
	chanceOfSuccess,
	chanceToContinuePath,
	closeInDistance,
	allPos,
}) => {
	const pushDir = pushDir_unbound.bind(null, ai.id, directionQueue)
	if (ai.state !== 'dead' && ai.state !== 'readyToMove') {
		const [x, y] = strToCoords(ai.body[0])
		let targetDistances = targets.map(key => {
			const [tX, tY] = strToCoords(key)
			return {
				key,
				distance: Math.hypot(Math.abs(tX - x), Math.abs(tY - y)),
			}
		})
		targetDistances.sort((a, b) => a.distance - b.distance)

		const [targetX, targetY] = strToCoords(targetDistances[0].key)

		const lastDir = directionQueue[ai.id][0]
		const random = Math.random()
		let xDistance = Math.abs(targetX - x)
		let yDistance = Math.abs(targetY - y)
		const isClose = xDistance <= closeInDistance && yDistance <= closeInDistance

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

		const qIndex = directionQueue[ai.id].length - 1
		const adjustDir = tryDirMove.bind(
			null,
			allPos,
			directionQueue,
			ai.id,
			x,
			y,
			chanceOfSuccess,
		)
		switch (directionQueue[ai.id][qIndex]) {
			case 'UP':
				if (allPos.includes(keysToString(x, y - 1))) {
					adjustDir()
					break
				} else {
					directionQueue[ai.id][0] = 'UP'
					break
				}

			case 'DOWN':
				if (allPos.includes(keysToString(x, y + 1))) {
					adjustDir()
					break
				} else {
					directionQueue[ai.id][0] = 'DOWN'
					break
				}

			case 'RIGHT':
				if (allPos.includes(keysToString(x + 1, y))) {
					adjustDir()
					break
				} else {
					directionQueue[ai.id][0] = 'RIGHT'
					break
				}

			case 'LEFT':
				if (allPos.includes(keysToString(x - 1, y))) {
					adjustDir()
					break
				} else {
					directionQueue[ai.id][0] = 'LEFT'
					break
				}
		}
	}

	if (ai.state === 'readyToMove') {
		pushDir('RIGHT')
	}
}

module.exports = { processAiMove }
