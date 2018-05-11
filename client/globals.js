let canMove = true

export const getMovementStatus = () => canMove
export const setMovementStatus = bool => (canMove = bool)

const playerMap = {}
export const setPlayerMap = (key, value) => (playerMap[key] = value)
export const getPlayerMap = id => playerMap[id]

// right now this is instead set on center component
// and not used as here
const markedMines = []
export const getMarkedMines = () => markedMines
export const setMarkedMines = mines => (markedMines = mines)
