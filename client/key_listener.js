import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'

export default (startingKey, socket, playerId) => {
	const keyPress$ = fromEvent(document, 'keydown')
		.startWith({ key: startingKey })
		.compose(
			dropRepeats((current, last) => {
				// if anything evaluates to true - ignore it
				switch (current.key) {
					case 'ArrowLeft':
						if (last.key === 'ArrowRight') return true
						return last.key === current.key
					case 'ArrowRight':
						if (last.key === 'ArrowLeft') return true
						return last.key === current.key
					case 'ArrowUp':
						if (last.key === 'ArrowDown') return true
						return last.key === current.key
					case 'ArrowDown':
						if (last.key === 'ArrowUp') return true
						return last.key === current.key
					default:
						return true
				}
			}),
		)

	keyPress$.addListener({
		next: keyEvent => {
			if (socket.readyState != 0) {
				socket.send(
					JSON.stringify({
						type: 'CHANGE_DIRECTION',
						id: playerId,
						direction: keyEvent.key.slice(5).toUpperCase(),
					}),
				)
			}
		},
		error: err => console.error(err),
		complete: () => console.log('completed'),
	})
}
