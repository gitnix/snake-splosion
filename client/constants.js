// width 1000 and height 600 is the base resolution
// can be scaled
// server grid columns and rows would also have to
// be multiplied by this number
const scale = 1.5
export const WIDTH = 1000 * scale
export const HEIGHT = 600 * scale

if (HEIGHT / WIDTH !== 0.6) throw Error('HEIGHT/WIDTH is not a ratio of 0.6')

// actual size of drawn images is controlled
// by changing the scale above
export const UNIT_SIZE = 20

export const COLOR_MAP = {
	GREEN: '#4CB546',
	BLUE: '#4A81AE',
	PINK: '#D42966',
	GOLD: '#CDBE4C',
	ORANGE: '#FBA93D',
	RED: '#FC3B40',
	BLACK: '#282C29',
	GRAY: '#A0A4A1',
	GRAY_SAND: '#94928E',
	GRAY_SAND_2: '#B7B0A1',
	NIGHT_SAND: '#394D7A',
	NIGHT_SAND_2: '#5E7099',
	CALM_SAND: '#836F58',
	CALM_SAND_2: '#A78D6E',
	SAND: '#AB834A',
	SAND_2: '#C58B37',
}
