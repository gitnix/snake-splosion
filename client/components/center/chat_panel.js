import React, { Component } from 'react'

import MessageList from './message_list'

import { setMovementStatus, getPlayerMap } from '../../globals'

class ChatPanel extends Component {
	constructor(props) {
		super(props)
		this.state = { value: 'Say Something' }

		this.onFocus = this.onFocus.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount() {
		// look into resize event listener
		document.addEventListener('keydown', e => {
			if (e.key === 'c') {
				this.inputDOM.focus()
			}
		})
	}

	onChange(e) {
		this.setState({ value: e.target.value })
	}

	onFocus() {
		setMovementStatus(false)
		setTimeout(() => this.setState({ value: '' }), 1)
	}

	onSubmit(e) {
		e.preventDefault()
		if (this.state.value === '') {
			this.inputDOM.blur()
			setMovementStatus(true)
			return
		}
		if (this.props.spectating) {
			if (this.props.socket.readyState !== 3) {
				this.props.socket.send(
					JSON.stringify({
						type: 'CHAT_MESSAGE',
						sender: `Spectator ${this.props.clientId.substring(0, 5)}`,
						color: 'ORANGE',
						contents: this.state.value,
					}),
				)
			}
		} else {
			this.props.socket.send(
				JSON.stringify({
					type: 'CHAT_MESSAGE',
					sender: getPlayerMap(this.props.clientId).name,
					color: getPlayerMap(this.props.clientId).color,
					contents: this.state.value,
				}),
			)
		}
		this.state.value = ''
		this.inputDOM.blur()
		setMovementStatus(true)
	}

	render() {
		return (
			<div id="chat-panel">
				<MessageList messages={this.props.messages} />
				<form id="chat-form" onSubmit={this.onSubmit}>
					Chat:
					<input
						id="chat-input"
						maxLength="110"
						type="text"
						value={this.state.value}
						onFocus={this.onFocus}
						onChange={this.onChange}
						ref={inputDOM => {
							this.inputDOM = inputDOM
						}}
					/>
					<div id="chat-help">
						<div>Press c to focus chat.</div>
						<div>Game will be refocused after message is sent.</div>
					</div>
				</form>
			</div>
		)
	}
}

export default ChatPanel
