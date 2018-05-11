import React, { Component } from 'react'
import { updateGame } from '../../update'

class MainCanvas extends Component {
	constructor(props) {
		super(props)
		this._ctx = null
		this._canvasRef
		this._child = (
			<canvas
				id="layer-1"
				width="800"
				height="600"
				style={{ backgroundImage: `url(backgrounds/sand.png)` }}
				ref={node => {
					this._ctx = node ? node.getContext('2d') : null
					this._canvasRef = node
				}}
			/>
		)
	}

	componentDidUpdate(prevProps) {
		updateGame(this.props.gameState, this._ctx, {
			width: this._canvasRef.width,
			height: this._canvasRef.height,
			mineTypeToDraw: this.props.mineTypeToDraw,
			info: this.props.gameState.gameInfo,
		})
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default MainCanvas
