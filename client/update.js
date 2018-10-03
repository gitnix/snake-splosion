import { divide, find, min, propEq } from 'ramda'

import { COLOR_MAP, UNIT_SIZE } from './constants'
import { clientState } from './client_state'
import { getBodyDirection, roundRect, scale, strToCoords } from './utils'
import { FOOD, MINE, MOUSE, TRIGGER, BODY, HEAD, TAIL } from './assets/images'

import {
	collisionAudio,
	eatAudio,
	explosionAudio,
	gameOverAudio,
	squeakAudio,
	teleportAudio,
} from './assets/audio'

let mouseFrame = 0
const mouseMaxFrame = 46
let mouseDrawDir = 'RIGHT'

// draw nothing if blinkTurn under this number
const blinkTimer = 150
// draw color square if > blinkTimer && < blinkTimer2
const blinkTimer2 = 250
// incremented each frame
const blinkTurn = {
	GREEN: 1,
	PINK: 1,
	BLUE: 1,
	GOLD: 1,
}
// for testing purposes
// so animation can be frozen at certain point
const shouldAnimate = true
// used to divide elapsed time
const denominator = 66
// used to store interpolated coords
let drawX, drawY
// used to store raw coords of head
let head_x, head_y

const drawUnit = (ctx, x, y, color) => {
	ctx.fillStyle = color
	ctx.fillRect(scale(x), scale(y), scale(), scale())
}

const playAudio = (players, id) => {
	const currentPlayer = find(propEq('id', id))(players)
	if (!currentPlayer) return
	switch (currentPlayer.state) {
		case 'dead':
			collisionAudio.play()
			break
		case 'teleported':
			teleportAudio.play()
			break
	}
}

const updateGame = timestamp => (
	state,
	ctx,
	{ width, height, mineTypeToDraw, spectating, gameStop },
) => {
	// shouldUpdate is true when server sends new state updated
	if (clientState.shouldUpdate) {
		clientState.start = timestamp
		clientState.shouldUpdate = false
	}
	// total elapsed time since last update message from server
	const elapsed = timestamp - clientState.start

	ctx.clearRect(0, 0, width, height)

	Object.keys(state.food).forEach(key => {
		const [x, y] = strToCoords(key)
		const foodType = state.food[key].type
		switch (foodType) {
			case 'APPLE':
				ctx.drawImage(FOOD['APPLE'], scale(x), scale(y))
				break
			case 'CHEESE':
				ctx.drawImage(FOOD['CHEESE'], scale(x), scale(y))
				break
		}
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

	state.mice.forEach(mouse => {
		const [x, y] = strToCoords(mouse.body[0])

		if (mouse.state === 'spawned') squeakAudio.play()

		const offset = 0.8
		mouseFrame += 1
		if (mouseFrame > mouseMaxFrame) mouseFrame = 0

		switch (mouse.bodyDirections[0]) {
			case 'RIGHT':
				mouseDrawDir = 'RIGHT'
				drawX = x - offset + min(offset, divide(elapsed, denominator))
				ctx.drawImage(
					mouseFrame <= mouseMaxFrame / 2
						? MOUSE[mouseDrawDir][1]
						: MOUSE[mouseDrawDir][2],
					scale(drawX),
					scale(y),
				)
				break
			case 'LEFT':
				mouseDrawDir = 'LEFT'
				drawX = x + offset - min(offset, divide(elapsed, denominator))
				ctx.drawImage(
					mouseFrame <= mouseMaxFrame / 2
						? MOUSE[mouseDrawDir][1]
						: MOUSE[mouseDrawDir][2],
					scale(drawX),
					scale(y),
				)
				break
			case 'UP':
				drawY = y + offset - min(offset, divide(elapsed, denominator))
				ctx.drawImage(
					mouseFrame <= mouseMaxFrame / 2
						? MOUSE[mouseDrawDir][1]
						: MOUSE[mouseDrawDir][2],
					scale(x),
					scale(drawY),
				)
				break
			case 'DOWN':
				drawY = y - offset + min(offset, divide(elapsed, denominator))
				ctx.drawImage(
					mouseFrame <= mouseMaxFrame / 2
						? MOUSE[mouseDrawDir][1]
						: MOUSE[mouseDrawDir][2],
					scale(x),
					scale(drawY),
				)
				break
		}
	})

	// sort so dead players are drawn last
	// and thus on top of other players
	state.players.sort(p => {
		if (p.state === 'dead') return 1
		return 0
	})

	state.players.forEach(player => {
		player.body.forEach((bodyString, index) => {
			const [x, y] = strToCoords(bodyString)
			// save the coords of head here since it is not
			// drawn until after body draws
			if (index == 0) {
				head_x = x
				head_y = y
			}

			// play eat audio for all players
			if (player.state === 'eating') eatAudio.play()
			// play explosion audio for all players
			if (
				player.state === 'dead' &&
				player.lastState !== 'dead' &&
				player.deathCause === 'mine'
			)
				explosionAudio.play()

			if (player.state === 'readyToMove') {
				blinkTurn[player.color]++
				if (blinkTurn[player.color] <= blinkTimer) {
					return
				}
				if (blinkTurn[player.color] > blinkTimer) {
					if (blinkTurn[player.color] >= blinkTimer2)
						blinkTurn[player.color] = 1
					drawUnit(ctx, x, y, COLOR_MAP[player.color])
				}
				return
			}

			const drawColor = player.state === 'dead' ? 'dead' : player.color
			const noInterpolate = ['dead', 'frozen'].includes(player.state)
			switch (index) {
				/////////////////////////
				// TAIL && HEAD
				case player.body.length - 1:
					// TAIL
					if (player.bodyDirections.length > 2) {
						const tailDirection = player.bodyDirections[player.body.length - 1]
						const preTailDirection =
							player.bodyDirections[player.body.length - 2]

						if (tailDirection !== preTailDirection) {
							ctx.drawImage(
								TAIL[drawColor][preTailDirection],
								scale(x),
								scale(y),
							)
						} else if (player.state === 'eating') {
							// 3 back here because new body part will be appended
							// to end when eating and need to go past that
							ctx.drawImage(
								TAIL[drawColor][player.bodyDirections[player.body.length - 3]],
								scale(x),
								scale(y),
							)
						} else if (clientState.playerMap[player.id].state === 'eating') {
							ctx.drawImage(
								TAIL[drawColor][player.bodyDirections[player.body.length - 2]],
								scale(x),
								scale(y),
							)
						} else if (clientState.countDown[player.id]) {
							ctx.drawImage(TAIL[drawColor][tailDirection], scale(x), scale(y))
						} else {
							const offset = 0.8
							const drawLimit = 60

							switch (preTailDirection) {
								case 'RIGHT':
									drawX = x - offset + min(offset, divide(elapsed, denominator))
									// drawing the body in these cases will
									// fill out the gap left by the tail interpolating
									if (!noInterpolate) {
										if (elapsed < drawLimit) {
											ctx.drawImage(
												BODY[drawColor][
													getBodyDirection(player.bodyDirections, index)
												],
												scale(drawX + offset),
												scale(y),
											)
										}
									}
									ctx.drawImage(
										TAIL[drawColor][preTailDirection],
										scale(noInterpolate ? x : drawX),
										scale(y),
									)
									break
								case 'LEFT':
									drawX = x + offset - min(offset, divide(elapsed, denominator))
									if (!noInterpolate) {
										if (elapsed < drawLimit) {
											ctx.drawImage(
												BODY[drawColor][
													getBodyDirection(player.bodyDirections, index)
												],
												scale(drawX - offset),
												scale(y),
											)
										}
									}
									ctx.drawImage(
										TAIL[drawColor][preTailDirection],
										scale(noInterpolate ? x : drawX),
										scale(y),
									)
									break
								case 'UP':
									drawY = y + offset - min(offset, divide(elapsed, denominator))
									if (!noInterpolate) {
										if (elapsed < drawLimit) {
											ctx.drawImage(
												BODY[drawColor][
													getBodyDirection(player.bodyDirections, index)
												],
												scale(x),
												scale(drawY - offset),
											)
										}
									}
									ctx.drawImage(
										TAIL[drawColor][preTailDirection],
										scale(x),
										scale(noInterpolate ? y : drawY),
									)
									break
								case 'DOWN':
									drawY = y - offset + min(offset, divide(elapsed, denominator))
									if (!noInterpolate) {
										if (elapsed < drawLimit) {
											ctx.drawImage(
												BODY[drawColor][
													getBodyDirection(player.bodyDirections, index)
												],
												scale(x),
												scale(drawY + offset),
											)
										}
									}
									ctx.drawImage(
										TAIL[drawColor][preTailDirection],
										scale(x),
										scale(noInterpolate ? y : drawY),
									)
									break
							}
						}
					}

					// HEAD
					// drawn last to ensure it is on top of body
					if (player.bodyDirections.length > 1) {
						// will be drawn back this amount and
						// interpolate up this amount to server location x/y
						const offset = 0.8
						/* will be drawn back this amount
						 on death so head overlaps
						 halfway on body collisions and
						 head on collisions meet in the middle
						*/
						const deathOffset = 0.5

						switch (player.direction) {
							case 'RIGHT':
								drawX =
									head_x - offset + min(offset, divide(elapsed, denominator))
								if (
									player.deathCause === 'self' ||
									player.deathCause === 'other'
								) {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(head_x - deathOffset),
										scale(head_y),
									)
								} else {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(noInterpolate ? head_x : drawX),
										scale(head_y),
									)
								}
								break

							case 'LEFT':
								drawX =
									head_x + offset - min(offset, divide(elapsed, denominator))
								if (
									player.deathCause === 'self' ||
									player.deathCause === 'other'
								) {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(head_x + deathOffset),
										scale(head_y),
									)
								} else {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(noInterpolate ? head_x : drawX),
										scale(head_y),
									)
								}
								break

							case 'UP':
								drawY =
									head_y + offset - min(offset, divide(elapsed, denominator))
								if (
									player.deathCause === 'self' ||
									player.deathCause === 'other'
								) {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(head_x),
										scale(head_y + deathOffset),
									)
								} else {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(head_x),
										scale(noInterpolate ? head_y : drawY),
									)
								}
								break

							case 'DOWN':
								drawY =
									head_y - offset + min(offset, divide(elapsed, denominator))
								if (
									player.deathCause === 'self' ||
									player.deathCause === 'other'
								) {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(head_x),
										scale(head_y - deathOffset),
									)
								} else {
									ctx.drawImage(
										HEAD[drawColor][player.direction],
										scale(head_x),
										scale(noInterpolate ? head_y : drawY),
									)
								}
								break
						}
					}
					//end head & tail
					break

				/////////////////////////
				// BODY
				default:
					// ignore head here. head is drawn when tail is drawn
					if (index == 0) {
						break
					}
					// if they are equal it means food was obtained and thus
					// the body at the end would be drawn over the tail
					// this avoids that
					if (bodyString !== player.body[player.body.length - 1]) {
						ctx.drawImage(
							BODY[drawColor][getBodyDirection(player.bodyDirections, index)],
							scale(x),
							scale(y),
						)
					}
					break
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

	if (state.gameInfo.winner && state.players.length > 0) {
		if (
			state.gameInfo.maxTicksUntilReset - state.gameInfo.ticksUntilReset <
			2
		) {
			gameOverAudio.play()
		}
		const winnerColor = state.players.find(
			p => p.id === state.gameInfo.winner.id,
		).color

		const textLineOffset = 60

		ctx.font = '52px Do Hyeon'
		ctx.textAlign = 'center'
		ctx.fillStyle = '#9e4646ed'
		roundRect(ctx, width * 0.01, height * 0.3, width * 0.98, height * 0.4, 20)
		ctx.fill()
		ctx.fillStyle = '#fdebbef5'
		ctx.fillText(
			`${state.gameInfo.winner.name}`,
			width / 2,
			height / 2 - textLineOffset,
		)
		ctx.fillText(`Wins!`, width / 2, height / 2)
		ctx.font = '48px Do Hyeon'
		ctx.fillText(`Restarting...`, width / 2, height / 2 + textLineOffset)
		ctx.fillStyle = '#F6F6F6'

		const centerWidth = width / 2
		const centerHeight = height / 2
		// const barOffset = width * 0.305
		const drawOffset =
			Math.round((state.gameInfo.maxTicksUntilReset / 3) * UNIT_SIZE) / 2
		const tailOffset = drawOffset + UNIT_SIZE
		const loadingHeight = 85

		roundRect(
			ctx,
			centerWidth - drawOffset,
			centerHeight + loadingHeight + UNIT_SIZE * 0.1,
			drawOffset,
			UNIT_SIZE * 0.8,
			20,
		)
		ctx.fill()

		const maxVal =
			Math.round(
				(state.gameInfo.maxTicksUntilReset - state.gameInfo.ticksUntilReset) /
					3,
			) - 1

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
					BODY[winnerColor]['CENTER_H'],
					centerWidth - drawOffset + i * UNIT_SIZE,
					centerHeight + loadingHeight,
				)
			}
		}
	}

	if (gameStop) {
		const textLineOffset = 60
		ctx.font = '52px Do Hyeon'
		ctx.textAlign = 'center'
		ctx.fillStyle = '#9e4646ed'
		roundRect(ctx, width * 0.01, height * 0.4, width * 0.98, height * 0.25, 20)
		ctx.fill()
		ctx.fillStyle = '#fdebbef5'
		ctx.fillText(
			`You have been disconnected due to inactivity.`,
			width / 2,
			height / 2,
		)
		ctx.fillText(
			`Click here to rejoin.`,
			width / 2,
			height / 2 + textLineOffset,
		)
	}

	if (shouldAnimate)
		window.requestAnimationFrame(newTimestamp =>
			updateGame(newTimestamp)(clientState.gameState, ctx, {
				width: clientState.width,
				height: clientState.height,
				mineTypeToDraw: clientState.mineTypeToDraw,
				spectating: clientState.spectating,
				gameStop: clientState.gameStop,
			}),
		)
}

export { playAudio, updateGame }
