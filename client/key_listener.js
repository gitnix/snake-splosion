import fromEvent from 'xstream/extra/fromEvent'
import dropRepeats from 'xstream/extra/dropRepeats'
import { equals, ifElse, or } from 'ramda'
import KEY_MAP from './key_map'

const shouldDrop = ifElse(
	({ curr }) => KEY_MAP.has(curr),
	({ curr, last }) => or(KEY_MAP.areOpposites(curr, last), equals(curr, last)),
	() => true,
)

export default (startingKey, socket, playerId) => {
	const keyPress$ = fromEvent(document, 'keydown')
		.startWith({ key: startingKey })
		.compose(
			dropRepeats((current, last) =>
				shouldDrop({ curr: current.key, last: last.key }),
			),
		)

	keyPress$.addListener({
		next: keyEvent => {
			if (socket.readyState != 0) {
				socket.send(
					JSON.stringify({
						type: 'CHANGE_DIRECTION',
						id: playerId,
						direction: KEY_MAP.toDirection(keyEvent.key),
					}),
				)
			}
		},
		error: err => console.error(err),
		complete: () => console.log('completed'),
	})
}
