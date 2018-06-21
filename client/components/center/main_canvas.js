import React, { Component } from 'react'
import { updateGame } from '../../update'
import { updateClientState } from '../../client_state'

class MainCanvas extends Component {
	constructor(props) {
		super(props)
		this._ctx = null
		this._canvasRef
		this._child = (
			<canvas
				id="layer-1"
				width="1000"
				height="600"
				style={{
					backgroundImage: `url(backgrounds/${this.props.backgroundImage}.png)`,
				}}
				ref={node => {
					this._ctx = node ? node.getContext('2d') : null
					this._canvasRef = node
				}}
			/>
		)
	}

	componentDidMount() {
		// need here in case make game rate slow and needs updated gameState
		// before server updates
		updateClientState(this.props, {
			width: this._canvasRef.width,
			height: this._canvasRef.height,
		})

		window.requestAnimationFrame(timestamp => {
			updateGame(timestamp)(this.props.gameState, this._ctx, {
				width: this._canvasRef.width,
				height: this._canvasRef.height,
				mineTypeToDraw: this.props.mineTypeToDraw,
				spectating: this.props.spectating,
				gameStop: this.props.gameStop,
			})
		})
	}

	componentDidUpdate() {
		updateClientState(this.props, {
			width: this._canvasRef.width,
			height: this._canvasRef.height,
		})
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default MainCanvas
