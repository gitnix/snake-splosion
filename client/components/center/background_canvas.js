import React, { Component } from 'react'
import { HEIGHT, WIDTH } from '../../constants'

class BackgroundCanvas extends Component {
	constructor(props) {
		super(props)
		this._child = (
			<canvas
				id="background-canvas"
				style={{
					backgroundImage: `url(backgrounds/${this.props.backgroundImage}.png)`,
				}}
				width={WIDTH}
				height={HEIGHT}
			/>
		)
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default BackgroundCanvas
