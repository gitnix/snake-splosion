const eatAudio = new Audio('audio/eat.mp3')
eatAudio.volume = 0.15

const collisionAudio = new Audio('audio/collision.mp3')
collisionAudio.volume = 0.2

const explosionAudio = new Audio('audio/explosion.mp3')
explosionAudio.volume = 0.5

export { collisionAudio, eatAudio, explosionAudio }
