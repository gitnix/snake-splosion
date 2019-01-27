let canMove = true

export const getMovementStatus = () => canMove
export const setMovementStatus = bool => (canMove = bool)

// will be filled out with more properties when updated
export const clientState = {
	countDown: {},
	playerMap: {},
	gameState: {},
	interpolation: true,
	lastKey: 'none',
}

export const setPlayerStateObj = (id, player, clientId) => {
	clientState.playerMap[id] = player
	if (id === clientId) {
		if (player.state === 'dead' || player.state === 'readyToMove') {
			clientState.lastKey = 'none'
		}
	}
	// keep track of previous state
	// used when interpolating tail
	// when starting from square
	if (clientState.countDown[id] > 0) {
		clientState.countDown[id]--
	}
	if (player.state === 'readyToMove' || player.state === 'connected') {
		clientState.countDown[id] = player.body.length
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
