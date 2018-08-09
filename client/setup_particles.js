import Proton from 'proton-js'
import { strToCoords } from './utils'
import { COLOR_MAP, UNIT_SIZE } from './constants'
import { EXPLOSION } from './assets/images'

export const addExplosionEmitter = (proton, positionString) => {
	const [x, y] = strToCoords(positionString)
	const emitter = new Proton.Emitter()

	// Rate takes number of emissions, time of each emission
	emitter.rate = new Proton.Rate(1)
	emitter.addInitialize(new Proton.Body(EXPLOSION))
	emitter.addInitialize(new Proton.Life(0.75))
	emitter.addBehaviour(new Proton.Alpha(0.65, 0))
	emitter.addBehaviour(new Proton.Scale(0.2, 0.8))
	emitter.p.x = x * UNIT_SIZE + UNIT_SIZE / 2
	emitter.p.y = y * UNIT_SIZE + UNIT_SIZE / 2
	emitter.emit('once', 'life')

	proton.addEmitter(emitter)
}

export const addTeleportedEmitter = (proton, [positionString, color]) => {
	const [x, y] = strToCoords(positionString)
	const emitter = new Proton.Emitter()

	emitter.rate = new Proton.Rate(Proton.getSpan(15, 25), 0.1)

	emitter.addInitialize(new Proton.Radius(1, 3))
	emitter.addInitialize(new Proton.Life(0, 0.8))
	emitter.addInitialize(
		new Proton.Velocity(0.8, Proton.getSpan(0, 360), 'polar'),
	)
	emitter.addBehaviour(new Proton.Color(COLOR_MAP[color]))
	emitter.addBehaviour(new Proton.Alpha(1))
	emitter.p.x = x * UNIT_SIZE + UNIT_SIZE / 2
	emitter.p.y = y * UNIT_SIZE + UNIT_SIZE / 2
	emitter.emit('once', 'life')

	proton.addEmitter(emitter)
}

export const addScatterEmitter = (proton, positionString, type) => {
	const [x, y] = strToCoords(positionString)
	const emitter = new Proton.Emitter()

	let scale,
		color,
		quantity1 = 3,
		quantity2 = 5,
		rate1 = 0.3,
		rate2 = 0.5,
		life1 = 0.3,
		life2 = 0.8,
		speed1 = 0.5,
		speed2 = 1

	switch (type) {
		case 'FOOD':
			scale = 0.2
			color = new Proton.Color(COLOR_MAP['RED'])
			break
		case 'DARK_MINE':
			scale = 0.4
			color = new Proton.Color(
				COLOR_MAP['BLACK'],
				COLOR_MAP['GRAY'],
				Infinity,
				Proton.easeInSine,
			)
			break
	}

	emitter.rate = new Proton.Rate(
		new Proton.Span(quantity1, quantity2),
		new Proton.Span(rate1, rate2),
	)

	emitter.addInitialize(new Proton.Life(life1, life2))
	emitter.addInitialize(
		new Proton.V(
			new Proton.Span(speed1, speed2),
			new Proton.Span(0, 360),
			'polar',
		),
	)

	emitter.addBehaviour(new Proton.Alpha(1, 0))
	emitter.addBehaviour(new Proton.Scale(scale, 0))
	emitter.addBehaviour(color)

	emitter.p.x = x * UNIT_SIZE + UNIT_SIZE / 2
	emitter.p.y = y * UNIT_SIZE + UNIT_SIZE / 2
	emitter.emit('once', 'life')

	proton.addEmitter(emitter)
}
