import React from 'react'

const PlayerCard = props => {
	const { ai, color, imgSrc, name, score, state, wins } = props
	const isDead = state === 'dead' ? true : false
	return (
		<div className={`player-card ${isDead ? 'dead' : ''}`}>
			<div className="player-image-container">
				<img className="player-image" src={imgSrc} />
				{ai ? <img className="bot-icon" src={'images/bot_icon.png'} /> : null}
			</div>
			<div className="player-name" style={{ backgroundColor: color }}>
				<div>{name}</div>
				<div className="player-wins">{`Wins: ${wins}`}</div>
			</div>
			<div className="player-score">
				<div className="player-score-header">Score</div>
				<div className="player-score-number">{score}</div>
			</div>
		</div>
	)
}

export default PlayerCard
