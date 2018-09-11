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

	const foodSettings = {
		scale: 0.3,
		quantity1: 3,
		quantity2: 5,
		rate1: 0.3,
		rate2: 0.5,
		life1: 0.3,
		life2: 0.5,
		speed1: 0.5,
		speed2: 1,
	}

	let color,
		// defaults are for sand
		scale = 0.2,
		quantity1 = 1,
		quantity2 = 3,
		rate1 = 0.2,
		rate2 = 0.4,
		life1 = 0.2,
		life2 = 0.5

	const speed1 = 0.5,
		speed2 = 1

	switch (type) {
		case 'FOOD':
			scale = foodSettings.scale
			quantity1 = foodSettings.quantity1
			quantity2 = foodSettings.quantity2
			rate1 = foodSettings.rate1
			rate2 = foodSettings.rate2
			life1 = foodSettings.life1
			life2 = foodSettings.life2
			color = new Proton.Color(COLOR_MAP['RED'])
			break
		case 'CHEESE':
			scale = foodSettings.scale
			quantity1 = foodSettings.quantity1
			quantity2 = foodSettings.quantity2
			rate1 = foodSettings.rate1
			rate2 = foodSettings.rate2
			life1 = foodSettings.life1
			life2 = foodSettings.life2
			color = new Proton.Color(COLOR_MAP['GOLD'])
			break
		case 'GRAY_SAND':
			color = new Proton.Color(COLOR_MAP['GRAY_SAND'], COLOR_MAP['GRAY_SAND_2'])
			break
		case 'NIGHT_SAND':
			color = new Proton.Color(
				COLOR_MAP['NIGHT_SAND'],
				COLOR_MAP['NIGHT_SAND_2'],
			)
			break
		case 'CALM_SAND':
			color = new Proton.Color(COLOR_MAP['CALM_SAND'], COLOR_MAP['CALM_SAND_2'])
			break
		case 'SAND':
			color = new Proton.Color(COLOR_MAP['SAND'], COLOR_MAP['SAND_2'])
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
