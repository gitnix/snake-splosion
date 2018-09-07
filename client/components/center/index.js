import React, { Component } from 'react'
import ChatPanel from './chat_panel'
import MainCanvas from './main_canvas'
import InfoPanel from './info_panel'
import TopEffectsCanvas from './top_effects_canvas'
import BackgroundCanvas from './background_canvas'
import BottomEffectsCanvas from './bottom_effects_canvas'

class Center extends Component {
	constructor(props) {
		super(props)
		this.reload = this.reload.bind(this)
	}

	reload() {
		if (this.props.gameStop) location.reload()
	}

	render() {
		return (
			<>
				<ChatPanel
					socket={this.props.socket}
					messages={this.props.messages}
					clientId={this.props.clientId}
					spectating={this.props.spectating}
				/>
				<div id="canvas-wrapper" onClick={this.reload}>
					<BackgroundCanvas backgroundImage={this.props.backgroundImage} />
					<BottomEffectsCanvas
						players={this.props.gameState.players}
						backgroundImage={this.props.backgroundImage}
					/>
					<MainCanvas
						gameState={this.props.gameState}
						mineTypeToDraw={this.props.mineTypeToDraw}
						spectating={this.props.spectating}
						gameStop={this.props.gameStop}
					/>
					<TopEffectsCanvas gameState={this.props.gameState} />
				</div>
				<InfoPanel />
			</>
		)
	}
}

export default Center
