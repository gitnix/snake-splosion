import React from 'react'

const InfoPanel = () => {
	return (
		<div id="info-panel-container">
			<div id="info-panel-content">
				<h1 id="info-panel-header">HOW TO PLAY</h1>
				<div id="info-panel-instructions">
					<ol>
						<li>Use Arrow Keys, WASD, or IJKL, to change direction.</li>
						<li>
							Eat food to grow your snake, raise your score, and spawn mines!
						</li>
						<li>Avoid the mines!</li>
						<li>Slither over detonators to clear mines!</li>
					</ol>
				</div>
			</div>
			<div id="about-container">
				<div id="about-content">
					<div id="about-created-by">Created By:</div>
					<div>Gitnix</div>
					<div id="about-github-img-container">
						<img id="about-github-img" src="images/github_icon_64px.png" />
					</div>
					<div>View on Github</div>
				</div>
			</div>
		</div>
	)
}
export default InfoPanel
