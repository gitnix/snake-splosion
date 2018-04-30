import { UNIT_SIZE } from '../../constants'
import { newImage } from '../../utils'

export const FOOD = {
	APPLE: newImage('images/food/apple.png'),
}

export const MINE = {
	DARK: newImage('images/mines/mine.png'),
	LIGHT: newImage('images/mines/mine2_sunny.png'),
}

export const BODY = {
	GREEN: {
		CENTER: newImage('images/body/green/body_green.png'),
		SW: newImage('images/body/green/body_green_sw.png'),
		NW: newImage('images/body/green/body_green_nw.png'),
		SE: newImage('images/body/green/body_green_se.png'),
		NE: newImage('images/body/green/body_green_ne.png'),
	},
	BLUE: {
		CENTER: newImage('images/body/blue/body_blue.png'),
		SW: newImage('images/body/blue/body_blue_sw.png'),
		NW: newImage('images/body/blue/body_blue_nw.png'),
		SE: newImage('images/body/blue/body_blue_se.png'),
		NE: newImage('images/body/blue/body_blue_ne.png'),
	},
}

export const HEAD = {
	GREEN: {
		UP: newImage('images/head/green/head_green_up.png'),
		DOWN: newImage('images/head/green/head_green_down.png'),
		LEFT: newImage('images/head/green/head_green_left.png'),
		RIGHT: newImage('images/head/green/head_green_right.png'),
	},
	BLUE: {
		UP: newImage('images/head/blue/head_blue_up.png'),
		DOWN: newImage('images/head/blue/head_blue_down.png'),
		LEFT: newImage('images/head/blue/head_blue_left.png'),
		RIGHT: newImage('images/head/blue/head_blue_right.png'),
	},
}

export const TAIL = {
	GREEN: {
		UP: newImage('images/tail/green/tail_green_up.png'),
		DOWN: newImage('images/tail/green/tail_green_down.png'),
		LEFT: newImage('images/tail/green/tail_green_left.png'),
		RIGHT: newImage('images/tail/green/tail_green_right.png'),
	},
	BLUE: {
		UP: newImage('images/tail/blue/tail_blue_up.png'),
		DOWN: newImage('images/tail/blue/tail_blue_down.png'),
		LEFT: newImage('images/tail/blue/tail_blue_left.png'),
		RIGHT: newImage('images/tail/blue/tail_blue_right.png'),
	},
}
