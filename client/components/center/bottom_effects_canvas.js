import React, { Component } from 'react'
import { chain, compose, contains, filter } from 'ramda'
import Proton from 'proton-js'
import { addScatterEmitter } from '../../setup_particles'
import { HEIGHT, WIDTH } from '../../constants'

class BottomEffectsCanvas extends Component {
	constructor(props) {
		super(props)
		this.renderer = null
		this.proton = null
		this._ctx = null
		this._canvas = null
		this._child = (
			<canvas
				id="bottom-effects-canvas"
				width={WIDTH}
				height={HEIGHT}
				ref={node => {
					this._ctx = node ? node.getContext('2d') : null
					this._canvas = node
				}}
			/>
		)
		this.protonArray = []
		this.players = []

		this.drawEffects = () => {
			if (!this._ctx) return
			this._ctx.clearRect(0, 0, this._child.width, this._child.height)

			if (!!this.players && this.players.length > 0) {
				this.players.forEach(p => {
					switch (this.props.backgroundImage) {
						case 'gray_sand':
							addScatterEmitter(this.proton, p, 'GRAY_SAND')
							break
						case 'night_sand':
							addScatterEmitter(this.proton, p, 'NIGHT_SAND')
							break
						case 'calm_sand':
							addScatterEmitter(this.proton, p, 'CALM_SAND')
							break
						case 'sand':
							addScatterEmitter(this.proton, p, 'SAND')
							break
					}
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
		this.players = compose(
			// don't want head since it is interpolated
			// and thus we'd see sand drawn in front of snake
			chain(p => p.body.slice(1)),
			filter(p => contains(p.state, ['eating', 'normal'])),
		)(this.props.players)
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default BottomEffectsCanvas
