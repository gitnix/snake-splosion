import React, { Component } from 'react'

class BackgroundCanvas extends Component {
	constructor(props) {
		super(props)
		this._child = (
			<canvas
				id="background-layer"
				style={{
					backgroundImage: `url(backgrounds/${this.props.backgroundImage}.png)`,
				}}
				width="1000"
				height="600"
			/>
		)
	}

	render() {
		// A constant element tells React to never re-render
		return this._child
	}
}

export default BackgroundCanvas
