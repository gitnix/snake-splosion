import Proton from 'proton-js'
import { strToCoords } from './utils'
import { UNIT_SIZE } from './constants'

const setupParticles = (canvas, positionString) => {
	const [x, y] = strToCoords(positionString)
	const proton = new Proton()
	const emitter = new Proton.Emitter()
	//set Rate
	emitter.rate = new Proton.Rate(Proton.getSpan(15, 25), 0.1)
	//add Initialize
	emitter.addInitialize(new Proton.Radius(1, 8))
	emitter.addInitialize(new Proton.Life(0, 0.4))
	emitter.addInitialize(
		new Proton.Velocity(3.5, Proton.getSpan(0, 360), 'polar'),
	)
	//add Behaviour
	emitter.addBehaviour(new Proton.Color('#ff0000', '#990000'))
	emitter.addBehaviour(new Proton.Alpha(1, 0))
	//set emitter position
	emitter.p.x = x * UNIT_SIZE
	emitter.p.y = y * UNIT_SIZE
	emitter.emit('once', 'life')
	//add emitter to the proton
	proton.addEmitter(emitter)
	// add canvas renderer
	const renderer = new Proton.CanvasRenderer(canvas)
	proton.addRenderer(renderer)

	return proton
}

export default setupParticles
