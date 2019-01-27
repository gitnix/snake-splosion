import React from 'react'

const svg = props => (
	<div className={props.className} onClick={props.onClick}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox="0 0 24 24">
			<path
				stroke={props.color}
				strokeWidth="0.3"
				d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"
			/>
		</svg>
	</div>
)

export default svg
