const eatAudio = new Audio('audio/adjusted_crunch.mp3')
eatAudio.volume = 0.5

const collisionAudio = new Audio('audio/collision.mp3')
collisionAudio.volume = 0.11

const explosionAudio = new Audio('audio/explosion.mp3')
explosionAudio.volume = 0.6

const teleportAudio = new Audio('audio/teleport.mp3')
teleportAudio.volume = 0.07

const gameOverAudio = new Audio('audio/snakecharmer.mp3')
gameOverAudio.volume = 0.1

export {
	collisionAudio,
	eatAudio,
	explosionAudio,
	gameOverAudio,
	teleportAudio,
}
