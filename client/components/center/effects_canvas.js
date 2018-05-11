import React, { Component } from 'react'
import { explosionAudio } from '../../assets/audio'
import setupParticles from '../../setup_particles'

class EffectsCanvas extends Component {
	constructor(props) {
		super(props)
		this._ctx = null
		this._canvas = null
		this._child = (
			<canvas
				id="layer-2"
				width="800"
				height="600"
				ref={node => {
					this._ctx = node ? node.getContext('2d') : null
					this._canvas = node
				}}
			/>
		)
		this.protonArray = []
		this.markedMines = []

		this.drawEffects = () => {
			if (!this._ctx) return
			this._ctx.clearRect(0, 0, this._child.width, this._child.height)
			if (!!this.markedMines && this.markedMines.length > 0) {
				explosionAudio.play()
				this.markedMines.forEach(m => {
					const proton = setupParticles(this._canvas, m)
					this.protonArray.push(proton)
				})
				this.markedMines.splice(0)
			}
			this.protonArray.forEach(p => p.update())
			// remove expired protons
			if (this.protonArray.length > 7) this.protonArray.splice(0, 3)
			window.requestAnimationFrame(this.drawEffects)
		}
	}

	componentDidMount() {
		window.requestAnimationFrame(this.drawEffects)
	}

	componentDidUpdate(prevProps) {
		this.markedMines = this.props.gameState.markedMines
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default EffectsCanvas
