import React, { Component } from 'react'
import { setPlayerMap } from './globals'
import { playAudio } from './update'
import addKeyListener from './key_listener'

import Top from './components/top'
import Center from './components/center'
import Bottom from './components/bottom'

import initialGameState from '../server/initial_game_state'

import './assets/snake.css'

class Client extends Component {
	constructor(props) {
		super(props)
		this.state = {
			gameState: {
				...initialGameState,
			},
			connectionProblem: false,
			messages: [],
			backgroundImage: null,
			mineTypeToDraw: null,
		}
		this.clientId = null
		this.mineTypeToDraw = null

		// this.socket = new WebSocket(`${protocol}://${location.host}`)
		this.socket = new WebSocket(`ws://${location.host}`)
	}

	componentDidMount() {
		this.socket.addEventListener('message', message => {
			const msg = JSON.parse(message.data)
			switch (msg.type) {
				case 'STATE_UPDATE':
					this.setState({ gameState: msg.state })
					msg.state.players.forEach(p => setPlayerMap(p.id, p))
					playAudio(msg.state.players, this.clientId)
					break
				case 'GAME_CONNECTION':
					this.clientId = msg.id
					this.setState({
						backgroundImage: msg.backgroundImage,
						mineTypeToDraw:
							msg.backgroundImage === 'night_sand' ? 'LIGHT' : 'DARK',
					})
					addKeyListener(msg.startingKey, this.socket, msg.id)
					break
				case 'CONNECTION_DENIED':
					this.setState({ connectionProblem: true })
					// display server full text
					break
				case 'CHAT_MESSAGE':
					this.setState({ messages: [...this.state.messages, msg.message] })
			}
		})
	}

	render() {
		return (
			<>
				<Top />
				<Center
					mineTypeToDraw={this.state.mineTypeToDraw}
					gameState={this.state.gameState}
					clientId={this.clientId}
					socket={this.socket}
					messages={this.state.messages}
				/>
				<Bottom players={this.state.gameState.players} />
			</>
		)
	}
}

export default Client
