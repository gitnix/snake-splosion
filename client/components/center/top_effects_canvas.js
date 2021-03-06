import React, { Component } from 'react'
import Proton from 'proton-js'
import { explosionAudio } from '../../assets/audio'
import {
	addExplosionEmitter,
	addTeleportedEmitter,
	addScatterEmitter,
} from '../../setup_particles'
import { HEIGHT, WIDTH } from '../../constants'

class EffectsCanvas extends Component {
	constructor(props) {
		super(props)
		this.renderer = null
		this.proton = null
		this._ctx = null
		this._canvas = null
		this._child = (
			<canvas
				id="top-effects-canvas"
				width={WIDTH}
				height={HEIGHT}
				ref={node => {
					this._ctx = node ? node.getContext('2d') : null
					this._canvas = node
				}}
			/>
		)
		this.protonArray = []
		this.markedMines = []
		this.teleportedPlayers = []
		this.eatingPlayers = []
		this.eatingMice = []
		this.newMines = []

		this.drawEffects = () => {
			if (!this._ctx) return
			this._ctx.clearRect(0, 0, this._child.width, this._child.height)
			if (!!this.markedMines && this.markedMines.length > 0) {
				explosionAudio.play()
				this.markedMines.forEach(m => {
					addExplosionEmitter(this.proton, m)
				})
				this.markedMines.splice(0)
			}

			if (!!this.teleportedPlayers && this.teleportedPlayers.length > 0) {
				this.teleportedPlayers.forEach(p => {
					addTeleportedEmitter(this.proton, p)
				})
			}

			if (!!this.newMines && this.newMines.length > 0) {
				this.newMines.forEach(m => {
					addScatterEmitter(this.proton, m, 'DARK_MINE')
				})
			}

			if (!!this.eatingPlayers && this.eatingPlayers.length > 0) {
				this.eatingPlayers.forEach(p => {
					if (p.eatItem === 'CHEESE') {
						addScatterEmitter(this.proton, p.positionString, 'CHEESE')
					} else {
						addScatterEmitter(this.proton, p.positionString, 'FOOD')
					}
				})
			}

			if (!!this.eatingMice && this.eatingMice.length > 0) {
				this.eatingMice.forEach(p => {
					addScatterEmitter(this.proton, p, 'CHEESE')
				})
			}

			this.proton.update()
			window.requestAnimationFrame(this.drawEffects)
		}
	}

	componentDidMount() {
		this.renderer = new Proton.CanvasRenderer(this._canvas)
		this.proton = new Proton()
		this.proton.addRenderer(this.renderer)
		window.requestAnimationFrame(this.drawEffects)
	}

	componentDidUpdate() {
		this.markedMines = this.markedMines.concat(this.props.gameState.markedMines)
		this.newMines = Object.keys(this.props.gameState.newMines)
		this.teleportedPlayers = this.props.gameState.players
			.filter(p => p.state === 'teleported')
			.map(p => [p.body[0], p.color])
		this.eatingPlayers = this.props.gameState.players
			.filter(p => p.state === 'eating')
			.map(p => ({ positionString: p.body[0], eatItem: p.eatItem }))
		this.eatingMice = this.props.gameState.mice
			.filter(m => m.state === 'eating')
			.map(m => m.body[0])
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default EffectsCanvas
