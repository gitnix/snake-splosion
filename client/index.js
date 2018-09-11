import React from 'react'
import ReactDOM from 'react-dom'
import Client from './client'

if (
	window.navigator.userAgent.includes('Chrome') ||
	window.navigator.userAgent.includes('Firefox')
) {
	ReactDOM.render(<Client />, document.getElementById('container'))
} else {
	ReactDOM.render(
		<div className="unsupported-browser">
			{'Sorry. Currently only Chrome and Firefox are supported. :('}
			<img style={{ gridArea: 'canvas' }} src="images/banner_snake.png" />
		</div>,
		document.getElementById('container'),
	)
}
