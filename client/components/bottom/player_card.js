import React from 'react'

const PlayerCard = props => {
	const { color, imgSrc, name, score } = props
	return (
		<div className="player-card">
			<div className="player-image-and-name-container">
				<img className="player-image" src={imgSrc} />
				<div className="player-name">{name}</div>
			</div>
			<div className="player-score">{score} pts</div>
			<div className="player-color" style={{ backgroundColor: color }} />
		</div>
	)
}

export default PlayerCard
