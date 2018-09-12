import React from 'react'
import ReactDOM from 'react-dom'
import Client from './client'

if (window.navigator.userAgent.includes('Chrome')) {
	ReactDOM.render(<Client />, document.getElementById('container'))
} else {
	ReactDOM.render(
		<div>
			<div style={{ marginBottom: '1em' }}>
				{
					'Unfortunately, due to performance limitations, currently only the Chrome browser is supported. :('
				}
			</div>
			<div>
				<img src="images/banner_snake.png" />
			</div>
		</div>,
		document.getElementById('unsupported-browser'),
	)
}
