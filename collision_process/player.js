const { getAllPlayerPositions } = require('../utils')

const processPlayerCollisions = ({ players, food }) => {
	const checkCollision = (head, otherPlayers) =>
		getAllPlayerPositions(otherPlayers).includes(head) ? true : false

	let markedPlayers = players.map(player => {
		let head = player.body[0]
		let isCollided = checkCollision(
			head,
			players.filter(p => p.id !== player.id),
		)
		return {
			...player,
			state: isCollided ? 'dead' : player.state,
			score: isCollided ? 0 : player.score,
			body: isCollided ? player.body.slice(1) : player.body,
		}
	})

	return {
		players: markedPlayers,
		food,
	}
}

module.exports = processPlayerCollisions
