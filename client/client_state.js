let canMove = true

export const getMovementStatus = () => canMove
export const setMovementStatus = bool => (canMove = bool)

export const clientState = {
	stateList: {},
	countDown: {},
	playerMap: {},
	gameState: {},
}

export const setPlayerStateObj = (id, player) => {
	clientState.playerMap[id] = player
	// keep track of previous state
	// used when interpolating tail
	if (!clientState.stateList[id]) {
		clientState.stateList[id] = []
		clientState.stateList[id].push(player.state)
		clientState.stateList[id].push(player.state)
	} else {
		clientState.stateList[id].push(player.state)
		clientState.stateList[id].shift()
	}

	if (clientState.countDown[id] > 0) {
		clientState.countDown[id]--
	}
	if (
		(clientState.stateList[id][0] === 'readyToMove' &&
			clientState.stateList[id][1] === 'normal') ||
		clientState.stateList[id][1] === 'connected'
	) {
		clientState.countDown[id] = player.body.length - 1
	}
}

export const updateClientState = (props, extras) => {
	clientState.shouldUpdate = true

	Object.keys(props).forEach(prop => {
		clientState[prop] = props[prop]
	})

	Object.keys(extras).forEach(extra => {
		clientState[extra] = extras[extra]
	})
}
