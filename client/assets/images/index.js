import { newImage } from '../../utils'

export const EXPLOSION = newImage('images/explosion.png')

export const FOOD = {
	APPLE: newImage('images/food/apple.png'),
}

export const MINE = {
	DARK: newImage('images/mines/mine.png'),
	LIGHT: newImage('images/mines/mine2_sunny.png'),
}

export const TRIGGER = {
	BANG: newImage('images/trigger_bang.png'),
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
	PINK: {
		CENTER: newImage('images/body/pink/body_pink.png'),
		SW: newImage('images/body/pink/body_pink_sw.png'),
		NW: newImage('images/body/pink/body_pink_nw.png'),
		SE: newImage('images/body/pink/body_pink_se.png'),
		NE: newImage('images/body/pink/body_pink_ne.png'),
		CENTER_H: newImage('images/body/pink/body_pink_h.png'),
		CENTER_V: newImage('images/body/pink/body_pink_v.png'),
	},
	GOLD: {
		CENTER: newImage('images/body/pink/body_pink.png'),
		SW: newImage('images/body/gold/body_gold_sw.png'),
		NW: newImage('images/body/gold/body_gold_nw.png'),
		SE: newImage('images/body/gold/body_gold_se.png'),
		NE: newImage('images/body/gold/body_gold_ne.png'),
		CENTER_H: newImage('images/body/gold/body_gold_h.png'),
		CENTER_V: newImage('images/body/gold/body_gold_v.png'),
	},
	dead: {
		CENTER: newImage('images/body/dead/body_dead.png'),
		SW: newImage('images/body/dead/body_dead_sw.png'),
		NW: newImage('images/body/dead/body_dead_nw.png'),
		SE: newImage('images/body/dead/body_dead_se.png'),
		NE: newImage('images/body/dead/body_dead_ne.png'),
		CENTER_H: newImage('images/body/dead/body_dead_h.png'),
		CENTER_V: newImage('images/body/dead/body_dead_v.png'),
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
	PINK: {
		UP: newImage('images/head/pink/head_pink_up.png'),
		DOWN: newImage('images/head/pink/head_pink_down.png'),
		LEFT: newImage('images/head/pink/head_pink_left.png'),
		RIGHT: newImage('images/head/pink/head_pink_right.png'),
	},
	GOLD: {
		UP: newImage('images/head/gold/head_gold_up.png'),
		DOWN: newImage('images/head/gold/head_gold_down.png'),
		LEFT: newImage('images/head/gold/head_gold_left.png'),
		RIGHT: newImage('images/head/gold/head_gold_right.png'),
	},
	dead: {
		UP: newImage('images/head/dead/head_dead_up.png'),
		DOWN: newImage('images/head/dead/head_dead_down.png'),
		LEFT: newImage('images/head/dead/head_dead_left.png'),
		RIGHT: newImage('images/head/dead/head_dead_right.png'),
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
	PINK: {
		UP: newImage('images/tail/pink/tail_pink_up.png'),
		DOWN: newImage('images/tail/pink/tail_pink_down.png'),
		LEFT: newImage('images/tail/pink/tail_pink_left.png'),
		RIGHT: newImage('images/tail/pink/tail_pink_right.png'),
	},
	GOLD: {
		UP: newImage('images/tail/gold/tail_gold_up.png'),
		DOWN: newImage('images/tail/gold/tail_gold_down.png'),
		LEFT: newImage('images/tail/gold/tail_gold_left.png'),
		RIGHT: newImage('images/tail/gold/tail_gold_right.png'),
	},
	dead: {
		UP: newImage('images/tail/dead/tail_dead_up.png'),
		DOWN: newImage('images/tail/dead/tail_dead_down.png'),
		LEFT: newImage('images/tail/dead/tail_dead_left.png'),
		RIGHT: newImage('images/tail/dead/tail_dead_right.png'),
	},
}
