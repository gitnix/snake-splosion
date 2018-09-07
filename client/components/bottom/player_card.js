import React from 'react'

const PlayerCard = props => {
	const { color, imgSrc, name, score, state } = props
	const isDead = state === 'dead' ? true : false
	return (
		<div className={`player-card ${isDead ? 'dead' : ''}`}>
			<div className="player-image-container">
				<img className="player-image" src={imgSrc} />
			</div>
			<div className="player-name" style={{ backgroundColor: color }}>
				{name}
			</div>
			<div className="player-score">
				<div className="player-score-header">Score</div>
				<div className="player-score-number">{score}</div>
			</div>
		</div>
	)
}

export default PlayerCard
