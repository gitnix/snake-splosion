import React, { Component } from 'react'
import { MOBILE_BREAKPOINT, FULL_SIZE_BREAKPOINT } from './constants'
import { setPlayerStateObj, clientState } from './client_state'
import { playAudio } from './update'
import addKeyListener from './key_listener'

import Top from './components/top'
import Center from './components/center'
import Bottom from './components/bottom'

import initialGameState from '../server/initial_game_state'
import { protocol } from './client_dev'

import './assets/snake.css'

// avoid scrolling when up/down arrow pressed
document.addEventListener('keydown', e => {
	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
			e.preventDefault()
	}
})

class Client extends Component {
	constructor(props) {
		super(props)
		this.state = {
			gameState: {
				...initialGameState,
			},
			messages: [],
			gameStop: false,
			viewSize:
				window.innerWidth <= MOBILE_BREAKPOINT
					? 'mobile'
					: window.innerWidth >= FULL_SIZE_BREAKPOINT
					? 'full'
					: 'compact',
		}
		this.updateDimensions = this.updateDimensions.bind(this)
		this.backgroundImage = 'sand'
		this.clientId = null
		this.mineTypeToDraw = 'DARK'
		this.spectating = null
		this.requestedConnection = false
		this.stateInitialized = false

		this.socket = new WebSocket(`${protocol}://${location.host}`)
		this.socket.addEventListener('message', message => {
			const msg = JSON.parse(message.data)
			switch (msg.type) {
				case 'STATE_UPDATE':
					if (this.requestedConnection) {
						this.setState({ gameState: msg.state })
						msg.state.players.forEach(p => {
							setPlayerStateObj(p.id, p, this.clientId)
						})
						playAudio(msg.state.players, this.clientId)
						this.stateInitialized = true
					}
					break
				case 'GAME_CONNECTION':
					this.clientId = msg.id
					clientState.lastKey = msg.startingKey
					this.backgroundImage = msg.backgroundImage
					this.mineTypeToDraw =
						this.backgroundImage === 'night_sand' ? 'LIGHT' : 'DARK'
					this.spectating = msg.spectating
					if (!this.spectating) {
						addKeyListener(msg.startingKey, this.socket, msg.id)
					}
					break
				case 'CHAT_MESSAGE':
					this.setState({ messages: [...this.state.messages, msg.message] })
					break
				case 'INACTIVITY_TIMEOUT':
					this.setState({ gameStop: true })
					break
			}
		})
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions)
		this.updateDimensions()
	}

	updateDimensions() {
		if (window.innerWidth <= MOBILE_BREAKPOINT) {
			this.setState({ viewSize: 'mobile' }, () => {
				const container = document.getElementById('container')
				if (!container.classList.contains('is-mobile')) {
					container.classList.add('is-mobile')
				}
				if (container.classList.contains('is-compact')) {
					container.classList.remove('is-compact')
				}
				if (container.classList.contains('is-full')) {
					container.classList.remove('is-full')
				}
			})
		} else {
			if (
				window.innerWidth > MOBILE_BREAKPOINT &&
				window.innerWidth < FULL_SIZE_BREAKPOINT
			) {
				this.setState({ viewSize: 'compact' }, () => {
					const container = document.getElementById('container')
					if (!container.classList.contains('is-compact')) {
						container.classList.add('is-compact')
					}
					if (container.classList.contains('is-mobile')) {
						container.classList.remove('is-mobile')
					}
					if (container.classList.contains('is-full')) {
						container.classList.remove('is-full')
					}
				})
			} else {
				this.setState({ viewSize: 'full' }, () => {
					const container = document.getElementById('container')
					if (!container.classList.contains('is-full')) {
						container.classList.add('is-full')
					}
					if (container.classList.contains('is-mobile')) {
						container.classList.remove('is-mobile')
					}
					if (container.classList.contains('is-compact')) {
						container.classList.remove('is-compact')
					}
				})
			}
		}
	}

	render() {
		if (this.spectating == null) {
			return (
				<>
					<Top viewSize={this.state.viewSize} />
					<div
						id="join-screen"
						onClick={() => {
							if (!this.requestedConnection) {
								this.requestedConnection = true
								this.socket.send(
									JSON.stringify({
										type: 'GAME_CONNECTION',
									}),
								)
							}
						}}>
						Click/touch to connect to a game session!
					</div>
				</>
			)
		}
		if (!this.stateInitialized) {
			return (
				<>
					<Top viewSize={this.state.viewSize} />
					<div id="join-screen">Joining...</div>
				</>
			)
		}
		return (
			<>
				<Top viewSize={this.state.viewSize} />
				<Center
					viewSize={this.state.viewSize}
					backgroundImage={this.backgroundImage}
					clientId={this.clientId}
					gameState={this.state.gameState}
					messages={this.state.messages}
					mineTypeToDraw={this.mineTypeToDraw}
					socket={this.socket}
					spectating={this.spectating}
					gameStop={this.state.gameStop}
				/>
				<Bottom
					viewSize={this.state.viewSize}
					players={this.state.gameState.players}
					socket={this.socket}
					clientId={this.clientId}
					spectating={this.spectating}
				/>
			</>
		)
	}
}

export default Client
