import React, { Component } from 'react'
import PlayerCard from './player_card'

import { COLOR_MAP } from '../../constants'

const Bottom = props => {
	return (
		<div id="players-container">
			{props.players.map(p => (
				<PlayerCard
					color={COLOR_MAP[p.color]}
					imgSrc="images/venomous_brown_tree_snake.jpg"
					key={p.name}
					name={p.name}
					score={p.score}
					state={p.state}
				/>
			))}
		</div>
	)
}

export default Bottom
