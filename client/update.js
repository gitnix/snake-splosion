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
import { FOOD, MINE, TRIGGER, BODY, HEAD, TAIL } from './assets/images'

import { collisionAudio, eatAudio, teleportAudio } from './assets/audio'

let blinkTurn = {
	GREEN: 1,
	PINK: 1,
	BLUE: 1,
	GOLD: 1,
}

const drawUnit = (ctx, x, y, color) => {
	ctx.fillStyle = color
	ctx.fillRect(scale(x), scale(y), scale(), scale())
}

const playAudio = (players, id) => {
	const currentPlayer = find(propEq('id', id))(players)
	if (!currentPlayer) return
	switch (currentPlayer.state) {
		case 'eating':
			eatAudio.play()
			break
		case 'dead':
			collisionAudio.play()
			break
		case 'teleported':
			teleportAudio.play()
			break
	}
}

const updateGame = (
	state,
	ctx,
	{ width, height, mineTypeToDraw, info, spectating, gameStop },
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

	Object.keys(state.triggers).forEach(key => {
		if (!state.triggers[key].isCollided) {
			const [x, y] = strToCoords(key)
			ctx.drawImage(TRIGGER['BANG'], scale(x), scale(y))
		}
	})

	state.players.forEach(player => {
		player.body.forEach((bodyString, index) => {
			const [x, y] = strToCoords(bodyString)
			if (player.state === 'teleported') {
				// for future
				// get location and set function in motion to draw a teleport thing over specified time
			}

			if (player.state === 'readyToMove') {
				blinkTurn[player.color]++
				if (blinkTurn[player.color] <= 10) {
					return
				}
				if (blinkTurn[player.color] > 10) {
					if (blinkTurn[player.color] >= 16) blinkTurn[player.color] = 1
					drawUnit(ctx, x, y, COLOR_MAP[player.color])
				}
				return
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
									getBodyDirection(player.bodyDirections, index, player.color)
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

	if (spectating && state.players.length > 0) {
		ctx.textAlign = 'left'
		ctx.fillText(`You are currently spectating`, 10, height - 56)
		ctx.fillText(`Refresh to join when`, 10, height - 32)
		ctx.fillText(`a spot becomes available`, 10, height - 8)
	}

	if (gameStop === true) {
		ctx.font = '52px Do Hyeon'
		ctx.textAlign = 'center'
		ctx.fillText(`All Players have left.`, width / 2, height / 2)
		ctx.fillText(`Refresh to start a match.`, width / 2, height / 2 + 60)
	}

	if (info.winner && state.players.length > 0) {
		const winnerColor = state.players.find(p => p.id === info.winner.id).color
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

export { playAudio, updateGame }
