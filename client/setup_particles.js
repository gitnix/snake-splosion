import Proton from 'proton-js'
import { strToCoords } from './utils'
import { UNIT_SIZE } from './constants'

const addEmitter = (proton, positionString) => {
	const [x, y] = strToCoords(positionString)
	const emitter = new Proton.Emitter()

	emitter.rate = new Proton.Rate(Proton.getSpan(15, 25), 0.1)

	emitter.addInitialize(new Proton.Radius(1, 8))
	emitter.addInitialize(new Proton.Life(0, 0.4))
	emitter.addInitialize(
		new Proton.Velocity(3.5, Proton.getSpan(0, 360), 'polar'),
	)
	emitter.addBehaviour(new Proton.Color('#ff0000', '#990000'))
	emitter.addBehaviour(new Proton.Alpha(1, 0))
	emitter.p.x = x * UNIT_SIZE
	emitter.p.y = y * UNIT_SIZE
	emitter.emit('once', 'life')

	proton.addEmitter(emitter)
}

export default addEmitter
