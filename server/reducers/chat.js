const { broadcast } = require('../utils')
const { websocket } = require('../server_state')
const phrases = require('../chat_phrases')

const chat = state => {
	const updatedPlayers = state.players.map(p => {
		if (!p.ai || p.score === 0) return p

		if (p.state === 'eating') {
			// chance that nothing will be said
			if (Math.random() <= 0.7) {
				return p
			}
			switch (p.eatItem) {
				case 'APPLE':
					broadcast(websocket.clients, {
						type: 'CHAT_MESSAGE',
						message: {
							contents:
								phrases.apple[Math.floor(Math.random() * phrases.apple.length)],
							sender: p.name,
							color: p.color,
						},
					})
					break
				case 'MOUSE':
					broadcast(websocket.clients, {
						type: 'CHAT_MESSAGE',
						message: {
							contents:
								phrases.mouse[Math.floor(Math.random() * phrases.mouse.length)],
							sender: p.name,
							color: p.color,
						},
					})
					break
				case 'CHEESE':
					broadcast(websocket.clients, {
						type: 'CHAT_MESSAGE',
						message: {
							contents:
								phrases.cheese[
									Math.floor(Math.random() * phrases.cheese.length)
								],
							sender: p.name,
							color: p.color,
						},
					})
					break
			}
		}

		if (
			p.state === 'dead' &&
			p.lastState !== 'dead' &&
			p.score / p.goalScore >= 0.9
		) {
			broadcast(websocket.clients, {
				type: 'CHAT_MESSAGE',
				message: {
					contents:
						phrases.closeToWinDead[
							Math.floor(Math.random() * phrases.closeToWinDead.length)
						],
					sender: p.name,
					color: p.color,
				},
			})
			return p
		}

		if (!p.chat.closeToWin && p.score / p.goalScore >= 0.7) {
			broadcast(websocket.clients, {
				type: 'CHAT_MESSAGE',
				message: {
					contents:
						phrases.closeToWin[
							Math.floor(Math.random() * phrases.closeToWin.length)
						],
					sender: p.name,
					color: p.color,
				},
			})
			return {
				...p,
				chat: { ...p.chat, closeToWin: true },
			}
		}

		if (!p.chat.hasWon && p.score >= p.goalScore) {
			broadcast(websocket.clients, {
				type: 'CHAT_MESSAGE',
				message: {
					contents:
						phrases.hasWon[Math.floor(Math.random() * phrases.hasWon.length)],
					sender: p.name,
					color: p.color,
				},
			})
			return {
				...p,
				chat: { ...p.chat, hasWon: true },
			}
		}

		if (p.state === 'dead' && p.lastState !== 'dead') {
			// chance that nothing will be said
			if (Math.random() <= 0.4) {
				return p
			}
			switch (p.deathCause) {
				case 'self':
					broadcast(websocket.clients, {
						type: 'CHAT_MESSAGE',
						message: {
							contents:
								phrases.selfCollision[
									Math.floor(Math.random() * phrases.selfCollision.length)
								],
							sender: p.name,
							color: p.color,
						},
					})
					break
				case 'other':
					broadcast(websocket.clients, {
						type: 'CHAT_MESSAGE',
						message: {
							contents:
								phrases.otherCollision[
									Math.floor(Math.random() * phrases.selfCollision.length)
								],
							sender: p.name,
							color: p.color,
						},
					})
					break
				case 'mine':
					broadcast(websocket.clients, {
						type: 'CHAT_MESSAGE',
						message: {
							contents:
								phrases.mineCollision[
									Math.floor(Math.random() * phrases.mineCollision.length)
								],
							sender: p.name,
							color: p.color,
						},
					})
					break
			}
		}

		return p
	})

	return {
		...state,
		players: updatedPlayers,
	}
}

module.exports = chat
