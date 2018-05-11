import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ChatPanel from './chat_panel'
import MainCanvas from './main_canvas'
import EffectsCanvas from './effects_canvas'

class Center extends Component {
	constructor(props) {
		super(props)
		this.chatRef = React.createRef()
	}

	render() {
		return (
			<div id="multi-canvas-container">
				<MainCanvas gameState={this.props.gameState} mineTypeToDraw={'DARK'} />
				<EffectsCanvas gameState={this.props.gameState} />
				<ChatPanel
					ref={this.chatRef}
					socket={this.props.socket}
					messages={this.props.messages}
					clientId={this.props.clientId}
				/>
			</div>
		)
	}
}

export default Center
