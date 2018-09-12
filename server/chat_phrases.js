const genericCollision = [
	'curses',
	'this is whack!',
	'argh',
	'who programmed me?',
	'dang!',
	'ok...',
	'sigh',
	'just a setback',
	'only a flesh wound',
	'i will rise again',
	':(',
	'!@$#',
]

const selfCollision = [
	...genericCollision,
	'woops',
	'oopsie',
	"i'm crap lol",
	'i should watch out for myself',
	'i need to get better...',
	'note to self - avoid self',
]

const otherCollision = [
	...genericCollision,
	'darn you!',
	"i can't believe this!",
	'Nooooo!!!',
	'i will get my revenge',
	'you just got lucky',
	'hiss off',
	'you should feel bad',
]

const mineCollision = [
	...genericCollision,
	'should have seen that coming',
	'who put that there',
	'i should haved mined my own business',
	'stupid mine',
]

const closeToWin = [
	"i'm gonna win!",
	'almost there',
	'getting close',
	'now not to whiff',
	'i can see the light at the end',
	'not to brag, but my score seems to be pretty high',
]

const closeToWinDead = [
	'i almost had it too!',
	'why!!!!!',
	'you should have just let me win',
	'you never let me win',
]

const hasWon = [
	'I won!',
	'haha suckers! I am best snake!',
	"you all didn't stand a chance",
	"I'm sure y'all are good at something",
	'me win. you all lose.',
	'ez',
	'gg... ya right',
	'gg',
	"y'all got wreckt!",
]

const genericFood = ['yummy', 'belch', 'nom nom nom']

const apple = [...genericFood, 'red and delicious', 'apple of my eye']

const mouse = [...genericFood, 'protein', 'so gooood!!']

const cheese = ['yuck', "i'm lactose intolerant", 'i feel bad']

module.exports = {
	apple,
	mouse,
	cheese,
	closeToWin,
	closeToWinDead,
	hasWon,
	mineCollision,
	otherCollision,
	selfCollision,
}
