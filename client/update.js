import { find, propEq } from 'ramda'

import { getBodyDirection, getTailDirection, scale, strToCoords } from './utils'
import { idFor, updateDOM } from './dom'
import {
	APPLE,
	MINE,
	BODY_GREEN,
	HEAD_GREEN,
	TAIL_GREEN,
} from './assets/images'

import { collisionAudio, eatAudio } from './assets/audio'

const drawUnit = (ctx, x, y, color) => {
	ctx.fillStyle = color
	ctx.fillRect(scale(x), scale(y), scale(), scale())
	ctx.stroke()
}

const playAudio = (players, id) => {
	const currentPlayer = find(propEq('id', id))(players)
	switch (currentPlayer.state) {
		case 'eating':
			eatAudio.play()
			break
		case 'dead':
			collisionAudio.play()
			break
	}
}

const updateImage = (id, state) => {
	switch (state) {
		case 'dead': {
			const pImage = idFor(id, 'image')
			pImage.classList.add('dead')
			const pCard = idFor(id, 'card')
			pCard.classList.add('dead')
			break
		}
		case 'teleported': {
			const pImage = idFor(id, 'image')
			pImage.classList.remove('dead')
			const pCard = idFor(id, 'card')
			pCard.classList.remove('dead')
			break
		}
	}
}

const updateUI = (players, playerId) => {
	const p1 = players.filter(p => p.id === playerId)[0]
	const otherPlayers = players.filter(p => p.id !== playerId)

	updateDOM(1, 'score', p1.score, ' pts')
	updateDOM(1, 'name', p1.name)
	updateImage(1, p1.state)

	otherPlayers.forEach((player, index) => {
		// first other player is 2 (0 + 2)
		const i = index + 2
		updateDOM(i, 'score', player.score, ' pts')
		updateDOM(i, 'name', player.name)
		updateImage(i, player.state)
	})
}

const updateGame = (state, ctx, width, height, cols, rows) => {
	ctx.clearRect(0, 0, width, height)

	Object.keys(state.food).forEach(key => {
		const [x, y] = strToCoords(key)
		ctx.drawImage(APPLE, scale(x), scale(y))
	})

	Object.keys(state.mines).forEach(key => {
		const [x, y] = strToCoords(key)
		ctx.drawImage(MINE, scale(x), scale(y))
	})

	state.players.forEach(player => {
		player.body.forEach((bodyString, index) => {
			const [x, y] = strToCoords(bodyString)
			if (player.state === 'teleported') {
				// for future
				// get location and set function in motion to draw a teleport thing over specified time
			}

			switch (index) {
				case 0:
					ctx.drawImage(HEAD_GREEN[player.direction], scale(x), scale(y))
					break
				case player.body.length - 1:
					ctx.drawImage(
						TAIL_GREEN[
							getTailDirection(player.body, player.direction, cols, rows)
						],
						scale(x),
						scale(y),
					)
					break
				default:
					switch (player.state) {
						case 'dead':
							drawUnit(ctx, x, y, 'gray')
							break
						default:
							ctx.drawImage(
								BODY_GREEN[getBodyDirection(player.bodyDirections, index)],
								scale(x),
								scale(y),
							)
					}
			}
		})
	})
}

export { playAudio, updateGame, updateUI }
