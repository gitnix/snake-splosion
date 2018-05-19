const eatAudio = new Audio('audio/eat.mp3')
eatAudio.volume = 0.12

const collisionAudio = new Audio('audio/collision.mp3')
collisionAudio.volume = 0.15

const explosionAudio = new Audio('audio/explosion.mp3')
explosionAudio.volume = 0.5

const teleportAudio = new Audio('audio/teleport.mp3')
teleportAudio.volume = 0.12

const gameOverAudio = new Audio('audio/snakecharmer2.mp3')
gameOverAudio.volume = 0.1

export {
	collisionAudio,
	eatAudio,
	explosionAudio,
	gameOverAudio,
	teleportAudio,
}
