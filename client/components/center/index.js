import React, { Component } from 'react'
import ChatPanel from './chat_panel'
import MainCanvas from './main_canvas'
import InfoPanel from './info_panel'
import TopEffectsCanvas from './top_effects_canvas'
import BackgroundCanvas from './background_canvas'
import BottomEffectsCanvas from './bottom_effects_canvas'
import ScoreOverlay from './score_overlay'
import { find, propEq } from 'ramda'

class Center extends Component {
	constructor(props) {
		super(props)
		this.reload = this.reload.bind(this)
	}

	reload() {
		if (this.props.gameStop) location.reload()
	}

	render() {
		let currentPlayer = null
		if (!this.props.spectating) {
			currentPlayer = find(propEq('id', this.props.clientId))(
				this.props.gameState.players,
			)
		}
		return (
			<>
				<ChatPanel
					socket={this.props.socket}
					messages={this.props.messages}
					clientId={this.props.clientId}
					spectating={this.props.spectating}
					viewSize={this.props.viewSize}
				/>
				<div
					id="canvas-wrapper"
					className={`is-${this.props.viewSize}`}
					onClick={this.reload}>
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
					{currentPlayer ? (
						<div
							id="score-overlay-container"
							className={`is-${this.props.viewSize}`}>
							<ScoreOverlay
								viewSize={this.props.viewSize}
								playerState={currentPlayer.state}
								lastPlayerState={currentPlayer.lastState}
								eatItem={currentPlayer.eatItem}
								color={currentPlayer.color}
							/>
						</div>
					) : null}
				</div>
				<InfoPanel viewSize={this.props.viewSize} />
			</>
		)
	}
}

export default Center
