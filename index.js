const width = 64
const height = 36
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const chunk = canvas.width / width
const Point = function (x, y) { this.x = x; this.y = y; this.in = (point) => point.x === this.x && point.y === this.y }
const color = {
  red: 'rgb(155,0,0)',
  darkred: 'rgb(100,0,0)',
  green: 'rgb(0,155,0)',
  yellow: 'rgb(255,255,0)'
}
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
    player.points = 0
  }
}

function setListener () {
  window.addEventListener('keydown', (e) => {
    player.movement = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key) ? e.key : player.movement
  })
};

function resetGame () {
  player.reset(20)
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
  }, 50)
};

function render () {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.beginPath()
  ctx.fillStyle = color.green
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.fillStyle = color.red
  ctx.strokeStyle = color.darkred
  ctx.arc(fruit.position.x * chunk + chunk / 2, fruit.position.y * chunk + chunk / 2, chunk / 3, 0, 2 * Math.PI, false)
  ctx.fill()

  player.body.forEach((coordenate) => {
    ctx.fillStyle = color.yellow
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
    player.size = player.size + player.points
    player.points++
    fruit.spawn(player.body)
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
