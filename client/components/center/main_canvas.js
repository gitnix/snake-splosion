import React, { Component } from 'react'
import { updateGame, updateState } from '../../update'

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
		updateState.shouldUpdate = true

		// need here in case make game rate slow and needs updated gameState
		// before server updates
		updateState.gameState = this.props.gameState
		updateState.mineTypeToDraw = this.props.mineTypeToDraw
		updateState.gameInfo = this.props.gameState.gameInfo
		updateState.spectating = this.props.spectating
		updateState.gameStop = this.props.gameStop
		updateState.width = this._canvasRef.width
		updateState.height = this._canvasRef.height

		this.props.gameState.players.forEach(player => {
			updateState.stateList[player.id] = []
			updateState.stateList[player.id].push(player.state)
			updateState.stateList[player.id].push(player.state)
		})

		window.requestAnimationFrame(timestamp => {
			updateGame(timestamp)(this.props.gameState, this._ctx, {
				width: this._canvasRef.width,
				height: this._canvasRef.height,
				mineTypeToDraw: this.props.mineTypeToDraw,
				info: this.props.gameState.gameInfo,
				spectating: this.props.spectating,
				gameStop: this.props.gameStop,
			})
		})
	}

	componentDidUpdate(prevProps) {
		// update state for update function to use
		updateState.shouldUpdate = true

		updateState.gameState = this.props.gameState
		updateState.mineTypeToDraw = this.props.mineTypeToDraw
		updateState.gameInfo = this.props.gameState.gameInfo
		updateState.spectating = this.props.spectating
		updateState.gameStop = this.props.gameStop
		updateState.width = this._canvasRef.width
		updateState.height = this._canvasRef.height

		// keep track of previous state
		// used when interpolating tail
		this.props.gameState.players.forEach(player => {
			if (!updateState.stateList[player.id]) {
				updateState.stateList[player.id] = []
				updateState.stateList[player.id].push(player.state)
				updateState.stateList[player.id].push(player.state)
			} else {
				updateState.stateList[player.id].push(player.state)
				updateState.stateList[player.id].shift()
			}

			if (updateState.countDown[player.id] > 0) {
				updateState.countDown[player.id]--
			}

			if (
				updateState.stateList[player.id][0] === 'readyToMove' &&
				updateState.stateList[player.id][1] === 'normal'
			) {
				updateState.countDown[player.id] = player.body.length - 1
			}
		})
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default MainCanvas
