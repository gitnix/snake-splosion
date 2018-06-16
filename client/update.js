import { divide, find, min, propEq } from 'ramda'

import { COLOR_MAP, UNIT_SIZE } from './constants'
import { getBodyDirection, roundRect, scale, strToCoords } from './utils'
import { FOOD, MINE, TRIGGER, BODY, HEAD, TAIL } from './assets/images'

import {
	collisionAudio,
	eatAudio,
	gameOverAudio,
	teleportAudio,
} from './assets/audio'

// draw nothing if blinkTurn under this number
let blinkTimer = 100
// draw color square if > blinkTimer && < blinkTimer2
let blinkTimer2 = 160
// incremented each frame
let blinkTurn = {
	GREEN: 1,
	PINK: 1,
	BLUE: 1,
	GOLD: 1,
}
// for testing purposes
// so animation can be frozen at certain point
let shouldAnimate = true
// singleton that componentDidUpdate writes state to
let updateState = { stateList: {}, countDown: {} }
// used to divide elapsed time
let denominator = 66
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

const updateGame = timestamp => (
	state,
	ctx,
	{ width, height, mineTypeToDraw, info, spectating, gameStop },
) => {
	// shouldUpdate is true when server sends new state updated
	if (updateState.shouldUpdate) {
		updateState.start = timestamp
		updateState.shouldUpdate = false
	}
	// total elapsed time since last update message from server
	let elapsed = timestamp - updateState.start

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
			// save the coords of head here since it is not
			// drawn until after body draws
			if (index == 0) {
				head_x = x
				head_y = y
			}

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

			let drawColor = player.state === 'dead' ? 'dead' : player.color
			let noInterpolate = ['dead', 'frozen'].includes(player.state)
			switch (index) {
				/////////////////////////
				// TAIL && HEAD
				case player.body.length - 1:
					// TAIL
					if (player.bodyDirections.length > 2) {
						let tailDirection = player.bodyDirections[player.body.length - 1]
						let preTailDirection = player.bodyDirections[player.body.length - 2]

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
						} else if (updateState.stateList[player.id][0] === 'eating') {
							ctx.drawImage(
								TAIL[drawColor][player.bodyDirections[player.body.length - 2]],
								scale(x),
								scale(y),
							)
						} else if (updateState.countDown[player.id]) {
							ctx.drawImage(TAIL[drawColor][tailDirection], scale(x), scale(y))
						} else {
							let offset = 0.8
							let drawLimit = 60

							switch (preTailDirection) {
								case 'RIGHT':
									drawX = x - offset + min(offset, divide(elapsed, denominator))
									// drawing the body in these cases will
									// fill out the gap left by the tail interpolating
									if (!noInterpolate) {
										if (elapsed < drawLimit) {
											ctx.drawImage(
												BODY[drawColor][
													getBodyDirection(
														player.bodyDirections,
														index,
														drawColor,
													)
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
													getBodyDirection(
														player.bodyDirections,
														index,
														drawColor,
													)
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
													getBodyDirection(
														player.bodyDirections,
														index,
														drawColor,
													)
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
													getBodyDirection(
														player.bodyDirections,
														index,
														drawColor,
													)
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
						// will be drawn  back this amount and
						// interpolate up this amount to server location x/y
						let offset = 0.8
						switch (player.direction) {
							case 'RIGHT':
								drawX =
									head_x - offset + min(offset, divide(elapsed, denominator))
								ctx.drawImage(
									HEAD[drawColor][player.direction],
									scale(noInterpolate ? head_x : drawX),
									scale(head_y),
								)
								break
							case 'LEFT':
								drawX =
									head_x + offset - min(offset, divide(elapsed, denominator))
								ctx.drawImage(
									HEAD[drawColor][player.direction],
									scale(noInterpolate ? head_x : drawX),
									scale(head_y),
								)
								break
							case 'UP':
								drawY =
									head_y + offset - min(offset, divide(elapsed, denominator))
								ctx.drawImage(
									HEAD[drawColor][player.direction],
									scale(head_x),
									scale(noInterpolate ? head_y : drawY),
								)
								break
							case 'DOWN':
								drawY =
									head_y - offset + min(offset, divide(elapsed, denominator))
								ctx.drawImage(
									HEAD[drawColor][player.direction],
									scale(head_x),
									scale(noInterpolate ? head_y : drawY),
								)
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
							BODY[drawColor][
								getBodyDirection(player.bodyDirections, index, drawColor)
							],
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

	if (gameStop === true) {
		ctx.font = '52px Do Hyeon'
		ctx.textAlign = 'center'
		ctx.fillText(`All Players have left.`, width / 2, height / 2)
		ctx.fillText(`Refresh to start a match.`, width / 2, height / 2 + 60)
	}

	if (info.winner && state.players.length > 0) {
		if (info.maxTicksUntilReset - info.ticksUntilReset < 2) {
			gameOverAudio.play()
		}
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
			Math.round((info.maxTicksUntilReset / 3) * UNIT_SIZE),
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
	if (shouldAnimate)
		window.requestAnimationFrame(newTimestamp =>
			updateGame(newTimestamp)(updateState.gameState, ctx, {
				width: updateState.width,
				height: updateState.height,
				mineTypeToDraw: updateState.mineTypeToDraw,
				info: updateState.gameInfo,
				spectating: updateState.spectating,
				gameStop: updateState.gameStop,
			}),
		)
}

export { playAudio, updateGame, updateState }
