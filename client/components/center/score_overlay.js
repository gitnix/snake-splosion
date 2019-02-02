import React, { Component } from 'react'
import { COLOR_MAP } from '../../constants'
import { DEAD_PHRASES, DETONATE_PHRASES } from './phrases'
import {
	APPLE_SCORE,
	CHEESE_SCORE,
	MOUSE_SCORE,
} from '../../../server/constants'

const pStates = ['eating', 'detonating', 'dead']

class ScoreOverlay extends Component {
	constructor(props) {
		super(props)
		// this forces react to rebuild the element
		// which is needed for the css animation to restart
		this.keyIncrement = 0
	}

	shouldComponentUpdate(nextProps) {
		if (
			nextProps.playerState !== nextProps.lastPlayerState &&
			pStates.includes(nextProps.playerState)
		) {
			return true
		}
		return false
	}

	render() {
		if (!this.props || !this.props.color) {
			return
		}

		if (this.keyIncrement === 0) {
			return (
				<div
					key={this.keyIncrement++}
					className={`score-overlay is-${this.props.viewSize}`}
					style={{
						color: COLOR_MAP[this.props.color],
					}}>
					{`You are ${this.props.color} snake!`}
				</div>
			)
		}

		if (!pStates.includes(this.props.playerState)) {
			return null
		}

		switch (this.props.playerState) {
			case 'dead':
				return (
					<div
						key={this.keyIncrement++}
						className={`score-overlay is-${this.props.viewSize}`}
						style={{
							color: COLOR_MAP[this.props.color],
						}}>
						{DEAD_PHRASES[Math.floor(Math.random() * DEAD_PHRASES.length)]}
					</div>
				)
			case 'detonating':
				return (
					<div
						key={this.keyIncrement++}
						className="score-overlay"
						style={{
							color: COLOR_MAP[this.props.color],
						}}>
						{
							DETONATE_PHRASES[
								Math.floor(Math.random() * DETONATE_PHRASES.length)
							]
						}
					</div>
				)
			case 'eating':
				switch (this.props.eatItem) {
					case 'APPLE':
						return (
							<div
								key={this.keyIncrement++}
								className="score-overlay"
								style={{
									color: COLOR_MAP[this.props.color],
								}}>
								{`+${APPLE_SCORE}`}
							</div>
						)
					case 'CHEESE':
						return (
							<div
								key={this.keyIncrement++}
								className="score-overlay"
								style={{
									color: COLOR_MAP['RED'],
								}}>
								{`${CHEESE_SCORE}`}
							</div>
						)
					case 'MOUSE':
						return (
							<div
								key={this.keyIncrement++}
								className="score-overlay"
								style={{
									color: COLOR_MAP[this.props.color],
								}}>
								{`+${MOUSE_SCORE}`}
							</div>
						)
				}
		}
	}
}

export default ScoreOverlay
