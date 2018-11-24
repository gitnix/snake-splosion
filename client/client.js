import React, { Component } from 'react'
import { setPlayerStateObj } from './client_state'
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
		}
		this.backgroundImage = 'sand'
		this.clientId = null
		this.mineTypeToDraw = 'DARK'
		this.spectating = null

		this.socket = new WebSocket(`${protocol}://${location.host}`)
		this.socket.addEventListener('message', message => {
			const msg = JSON.parse(message.data)
			switch (msg.type) {
				case 'STATE_UPDATE':
					this.setState({ gameState: msg.state })
					msg.state.players.forEach(p => {
						setPlayerStateObj(p.id, p)
					})
					playAudio(msg.state.players, this.clientId)
					break
				case 'GAME_CONNECTION':
					this.spectating = msg.spectating
					this.clientId = msg.id
					this.backgroundImage = msg.backgroundImage
					this.mineTypeToDraw =
						this.backgroundImage === 'night_sand' ? 'LIGHT' : 'DARK'
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

	render() {
		if (this.spectating == null) return <div />
		return (
			<>
				<Top />
				<Center
					backgroundImage={this.backgroundImage}
					clientId={this.clientId}
					gameState={this.state.gameState}
					messages={this.state.messages}
					mineTypeToDraw={this.mineTypeToDraw}
					socket={this.socket}
					spectating={this.spectating}
					gameStop={this.state.gameStop}
				/>
				<Bottom players={this.state.gameState.players} />
			</>
		)
	}
}

export default Client
