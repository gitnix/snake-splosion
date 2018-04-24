const { getAllPlayerPositions } = require('../../utils')

const processPlayerCollisions = ({ players, food }) => {
	const checkCollision = (head, otherPlayers) =>
		getAllPlayerPositions(otherPlayers).includes(head) ? true : false

	let collisionArray = []

	let markedPlayers = players.map(player => {
		let shouldSlice = true
		let head = player.body[0]
		let isCollided = checkCollision(
			head,
			players.filter(p => p.id !== player.id),
		)
		if (isCollided) {
			if (collisionArray.includes(player.body[0])) shouldSlice = false
			else collisionArray.push(player.body[0])
		}
		return {
			...player,
			state: isCollided ? 'dead' : player.state,
			score: isCollided ? 0 : player.score,
			body: isCollided && shouldSlice ? player.body.slice(1) : player.body,
		}
	})

	return {
		players: markedPlayers,
		food,
	}
}

module.exports = processPlayerCollisions
