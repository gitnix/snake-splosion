import { find, propEq } from 'ramda'

import { COLOR_MAP, UNIT_SIZE } from './constants'
import {
	getBodyDirection,
	getTailDirection,
	roundRect,
	scale,
	strToCoords,
} from './utils'
import { idFor, updateDOM } from './dom'
import { FOOD, MINE, BODY, HEAD, TAIL } from './assets/images'

import { collisionAudio, eatAudio } from './assets/audio'

const drawUnit = (ctx, x, y, color) => {
	ctx.fillStyle = color
	ctx.fillRect(scale(x), scale(y), scale(), scale())
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

const setBackgroundImage = backgroundString =>
	(document.getElementById(
		'layer-1',
	).style.backgroundImage = `url(backgrounds/${backgroundString}.png)`)

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
	const playerColorDiv = idFor(1, 'color')
	playerColorDiv.style.background = COLOR_MAP[p1.color]

	otherPlayers.forEach((player, index) => {
		// first other player is 2 (0 + 2)
		const i = index + 2
		updateDOM(i, 'score', player.score, ' pts')
		updateDOM(i, 'name', player.name)
		updateImage(i, player.state)
		const playerColorDiv = idFor(i, 'color')
		playerColorDiv.style.background = COLOR_MAP[player.color]
	})
}

const updateGame = (
	state,
	ctx,
	{ width, height, cols, rows, mineTypeToDraw, info },
) => {
	ctx.clearRect(0, 0, width, height)

	Object.keys(state.food).forEach(key => {
		const [x, y] = strToCoords(key)
		ctx.drawImage(FOOD['APPLE'], scale(x), scale(y))
	})

	Object.keys(state.mines).forEach(key => {
		const [x, y] = strToCoords(key)
		ctx.drawImage(MINE[mineTypeToDraw], scale(x), scale(y))
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
					ctx.drawImage(
						HEAD[player.color][player.direction],
						scale(x),
						scale(y),
					)
					break
				case player.body.length - 1:
					ctx.drawImage(
						TAIL[player.color][player.bodyDirections[player.body.length - 2]],
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
								BODY[player.color][
									getBodyDirection(player.bodyDirections, index)
								],
								scale(x),
								scale(y),
							)
					}
			}
		})
	})

	ctx.fillStyle = '#9e4646ed'
	ctx.font = '24px Do Hyeon'
	ctx.textAlign = 'center'
	ctx.fillText(
		`Mines: ${Object.keys(state.mines).length}`,
		width / 2,
		height - 8,
	)

	if (info.winner) {
		const winnerColor = state.players.find(p => p.id === info.winner.id).color
		ctx.fillStyle = 'red'
		ctx.font = '52px Do Hyeon'
		ctx.textAlign = 'center'
		ctx.fillText(`${info.winner.name}`, width / 2, height / 2 - 60)
		ctx.fillText(`Wins!`, width / 2, height / 2)
		ctx.font = '48px Do Hyeon'
		ctx.fillText(`Restarting...`, width / 2, height / 2 + 60)
		ctx.fillStyle = '#F6F6F6'

		const centerWidth = width / 2
		const centerHeight = height / 2
		const barOffset = 305
		const drawOffset = 305
		const tailOffset = drawOffset + 20
		const loadingHeight = 85

		console.log('going to draw reoundRect')
		roundRect(
			ctx,
			centerWidth - barOffset,
			centerHeight + loadingHeight,
			Math.round(info.maxTicksUntilReset / 3 * UNIT_SIZE),
			20,
			20,
		)
		ctx.fill()

		const maxVal =
			Math.round((info.maxTicksUntilReset - info.ticksUntilReset) / 3) - 1

		ctx.drawImage(
			TAIL[winnerColor]['RIGHT'],
			centerWidth - tailOffset,
			centerHeight + loadingHeight,
		)

		for (let i = maxVal; i >= 0; i--) {
			if (i === maxVal) {
				ctx.drawImage(
					HEAD[winnerColor]['RIGHT'],
					centerWidth - drawOffset + i * UNIT_SIZE,
					centerHeight + loadingHeight,
				)
			} else {
				ctx.drawImage(
					BODY[winnerColor]['CENTER'],
					centerWidth - drawOffset + i * UNIT_SIZE,
					centerHeight + loadingHeight,
				)
			}
		}
	}
}

const displayServerFullText = (ctx, width, height) => {
	ctx.fillStyle = 'red'
	ctx.font = '48px Do Hyeon'
	ctx.textAlign = 'center'
	ctx.fillText('The server is currently full of snakes.', width / 2, height / 2)
	ctx.fillText('Check back again later.', width / 2, height / 2 + 60)
}

export {
	displayServerFullText,
	playAudio,
	setBackgroundImage,
	updateGame,
	updateUI,
}
