import React, { Component } from 'react'
import { updateGame } from '../../update'
import { clientState, updateClientState } from '../../client_state'

class MainCanvas extends Component {
	constructor(props) {
		super(props)
		this._ctx = null
		this._canvasRef
		this._child = (
			<canvas
				id="main-layer"
				width="1000"
				height="600"
				ref={node => {
					this._ctx = node ? node.getContext('2d') : null
					this._canvasRef = node
				}}
			/>
		)
	}

	componentDidMount() {
		updateClientState(this.props, {
			width: this._canvasRef.width,
			height: this._canvasRef.height,
		})

		// the updateGame function internally
		// imports clientState and gets values from that.
		// as for this initial startup- could just as
		// easily pass props directly here, but need to call
		// updateClientState above regardless, because server
		// may not send an update before the draw function needs
		// something in clientState
		window.requestAnimationFrame(newTimestamp =>
			updateGame(newTimestamp)(clientState.gameState, this._ctx, {
				width: clientState.width,
				height: clientState.height,
				mineTypeToDraw: clientState.mineTypeToDraw,
				spectating: clientState.spectating,
				gameStop: clientState.gameStop,
			}),
		)
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
