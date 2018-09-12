import React from 'react'
import PlayerCard from './player_card'

import { COLOR_MAP } from '../../constants'

const Bottom = props => {
	return (
		<div id="players-container">
			{props.players.map((p, idx) => (
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

export default Bottom
