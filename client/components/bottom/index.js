import React, { Component } from 'react'
import PlayerCard from './player_card'
import Arrow from './arrow'
import { COLOR_MAP } from '../../constants'
import KEY_MAP from '../../key_map'
import { clientState } from '../../client_state'

class Bottom extends Component {
	constructor(props) {
		super(props)
		this.turn = this.turn.bind(this)
	}

	// using key instead of raw direction since
	// keymap already set up to work with keys
	turn(key) {
		if (this.props.socket.readyState != 0) {
			if (
				key === clientState.lastKey ||
				KEY_MAP.areOpposites(key, clientState.lastKey) ||
				clientState.playerMap[this.props.clientId].state === 'dead'
			) {
				return
			}
			clientState.lastKey = key
			this.props.socket.send(
				JSON.stringify({
					type: 'CHANGE_DIRECTION',
					id: this.props.clientId,
					direction: KEY_MAP.toDirection(key),
				}),
			)
		}
	}

	render() {
		const playerColor =
			COLOR_MAP[clientState.playerMap[this.props.clientId].color]
		switch (this.props.viewSize) {
			case 'mobile':
				return (
					<div className="arrow-container">
						<Arrow
							className="arrow arrow-left"
							color={playerColor}
							onClick={() => this.turn('ArrowLeft')}
						/>
						<Arrow
							className="arrow arrow-right"
							color={playerColor}
							onClick={() => this.turn('ArrowRight')}
						/>
						<Arrow
							className="arrow arrow-up"
							color={playerColor}
							onClick={() => this.turn('ArrowUp')}
						/>
						<Arrow
							className="arrow arrow-down"
							color={playerColor}
							onClick={() => this.turn('ArrowDown')}
						/>
					</div>
				)
			case 'compact':
				return null
			default:
				return (
					<div id="players-container">
						{this.props.players.map((p, idx) => (
							<PlayerCard
								color={COLOR_MAP[p.color]}
								imgSrc={p.img}
								key={idx}
								name={p.name}
								score={p.score}
								state={p.state}
								ai={p.ai}
								wins={p.wins}
							/>
						))}
					</div>
				)
		}
	}
}

export default Bottom
