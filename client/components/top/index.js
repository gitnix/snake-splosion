import React from 'react'
import { BANNER_TITLE } from '../../constants'

const Top = props => {
	if (props.viewSize !== 'full') {
		return (
			<div id="banner" className={`is-${props.viewSize}`}>
				<div id="banner-title" className={`is-${props.viewSize}`}>
					{BANNER_TITLE}
				</div>
			</div>
		)
	}
	return (
		<div id="banner">
			<img id="banner-snake" src="images/banner_snake.png" />
			<div id="banner-title">{BANNER_TITLE}</div>
			<img id="banner-fire" src="images/banner_fire.png" />
		</div>
	)
}
export default Top
