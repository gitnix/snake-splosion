import { find, propEq } from 'ramda'

import { idFor, updateDOM, scale, strToCoords, noop } from './utils'
import {
	appleImage,
	snakeSkin,
	head_up,
	head_down,
	head_left,
	head_right,
} from './assets/images'
import { eatAudio, collisionAudio } from './assets/audio'

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
			break
		}
		case 'teleported': {
			const pImage = idFor(id, 'image')
			pImage.classList.remove('dead')
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

const updateGame = (state, ctx, width, height) => {
	ctx.clearRect(0, 0, width, height)

	Object.keys(state.food).forEach(key => {
		const [x, y] = strToCoords(key)
		ctx.drawImage(appleImage, scale(x), scale(y))
	})

	state.players.forEach(player => {
		player.body.forEach((bodyString, index) => {
			const [x, y] = strToCoords(bodyString)
			if (player.state === 'teleported') {
				// for future
				// get location and set function in motion to draw a teleport thing over specified time
			}

			if (index === 0) {
				switch (player.direction) {
					case 'RIGHT':
						ctx.drawImage(head_right, scale(x), scale(y))
						break
					case 'LEFT':
						ctx.drawImage(head_left, scale(x), scale(y))
						break
					case 'UP':
						ctx.drawImage(head_up, scale(x), scale(y))
						break
					case 'DOWN':
						ctx.drawImage(head_down, scale(x), scale(y))
						break
				}
			} else {
				switch (player.state) {
					case 'dead':
						drawUnit(ctx, x, y, 'gray')
						break
					default:
						ctx.drawImage(snakeSkin, scale(x), scale(y))
						break
				}
			}
		})
	})
}

export { playAudio, updateGame, updateUI }
