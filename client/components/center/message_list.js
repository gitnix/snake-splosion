import React from 'react'
import { COLOR_MAP } from '../../constants'

const MessageList = props => {
	return (
		<ul id="message-list">
			{props.messages.map((m, idx) => (
				<li key={idx}>
					<div
						className="chat-message-sender"
						style={{ color: COLOR_MAP[m.color] }}>
						{m.sender}
					</div>
					<div className="chat-message">{m.contents}</div>
				</li>
			))}
		</ul>
	)
}

export default MessageList
