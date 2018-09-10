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
		this.state = {
			animating: false,
			value: null,
		}
		this.onAnimationEnd = this.onAnimationEnd.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.animating && nextState.animating === false) return true

		if (
			pStates.includes(nextProps.playerState) ||
			pStates.includes(this.props.playerState)
		) {
			return true
		}
		return false
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.playerState !== prevProps.playerState &&
			pStates.includes(this.props.playerState)
		) {
			switch (this.props.playerState) {
				case 'dead':
					this.setState({
						animating: true,
						value:
							DEAD_PHRASES[Math.floor(Math.random() * DEAD_PHRASES.length)],
					})
					break
				case 'detonating':
					this.setState({
						animating: true,
						value:
							DETONATE_PHRASES[
								Math.floor(Math.random() * DETONATE_PHRASES.length)
							],
					})
					break
				case 'eating':
					let valueString = ''
					switch (this.props.eatItem) {
						case 'APPLE':
							valueString = `+${APPLE_SCORE}`
							break
						case 'CHEESE':
							valueString = `${CHEESE_SCORE}`
							break
						case 'MOUSE':
							valueString = `+${MOUSE_SCORE}`
							break
					}
					this.setState({ animating: true, value: valueString })
					break
			}
		}
	}

	onAnimationEnd(e) {
		this.setState({ animating: false })
	}

	render() {
		let classString = `score-overlay ${
			this.state.animating ? 'score-overlay-animating' : ''
		}`
		return (
			<div
				className={classString}
				style={{
					color:
						this.state.value === `${CHEESE_SCORE}`
							? 'red'
							: COLOR_MAP[this.props.color],
				}}
				onAnimationEnd={this.onAnimationEnd}>
				{this.state.value}
			</div>
		)
	}
}

export default ScoreOverlay
