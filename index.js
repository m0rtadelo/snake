const width = 64
const height = 36
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const chunk = canvas.width / width
const Point = function (x, y) { this.x = x; this.y = y; this.in = (point) => point.x === this.x && point.y === this.y }
const fruit = {
  position: new Point(0, 0),
  spawn: (avoid) => {
    do {
      fruit.position.x = Math.floor(Math.random() * width)
      fruit.position.y = Math.floor(Math.random() * height)
    } while (avoid.some(body => body.in(fruit.position)))
  }
}
const player = {
  add: {
    x: (x) => { player.position.x = player.position.x + x },
    y: (y) => { player.position.y = player.position.y + y }
  },
  reset: (size) => {
    player.position = new Point(width / 2, height / 2)
    player.movement = 'ArrowRight'
    player.body = []
    player.size = size
  }
}

function setListener () {
  window.addEventListener('keydown', (e) => {
    player.movement = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key) ? e.key : player.movement
  })
};

function resetGame () {
  player.reset(35)
  fruit.spawn(player.body)
}

function startGame () {
  setListener()
  resetGame()
  setInterval(() => {
    movePlayer()
    setPosition()
    render()
    checkCollisions()
  }, 100)
};

function render () {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.beginPath()
  ctx.fillStyle = 'rgb(255,255,0)'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.fillStyle = 'rgb(0,255,0)'
  ctx.fillRect(fruit.position.x * chunk, fruit.position.y * chunk, chunk, chunk)
  ctx.stroke()

  player.body.forEach((coordenate) => {
    ctx.fillStyle = 'rgb(0,0,255)'
    ctx.fillRect(coordenate.x * chunk, coordenate.y * chunk, chunk, chunk)
    ctx.stroke()
  })
};

function checkCollisions () {
  const snakeHead = player.body[player.body.length - 1]
  for (let i = 0; i < player.body.length - 1; i++) {
    if ((snakeHead.in(player.body[i])) ||
      snakeHead.x < 0 || snakeHead.x >= width || snakeHead.y < 0 || snakeHead.y >= height) {
      resetGame()
    }
  }
  if (fruit.position.in(snakeHead)) {
    player.size = player.size + Math.floor(player.size / 4)
    fruit.spawn()
  }
}

function setPosition () {
  player.body.push(new Point(player.position.x, player.position.y))
  if (player.body.length > player.size) {
    player.body = player.body.splice(1)
  }
};

function movePlayer () {
  player.add.x(player.movement.includes('ArrowRight') ? 1 : player.movement.includes('ArrowLeft') ? -1 : 0)
  player.add.y(player.movement.includes('ArrowDown') ? 1 : player.movement.includes('ArrowUp') ? -1 : 0)
}

startGame()
