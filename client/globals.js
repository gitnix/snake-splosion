let canMove = true

export const getMovementStatus = () => canMove
export const setMovementStatus = bool => (canMove = bool)

const playerMap = {}
export const setPlayerMap = (key, value) => (playerMap[key] = value)
export const getPlayerMap = id => playerMap[id]
