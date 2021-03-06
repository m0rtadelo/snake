const width = 64
const height = 36
const pointDOM = document.getElementById('points')
const bestDOM = document.getElementById('best')
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
const status = {
  menu: 'MENU',
  playing: 'PLAYING',
  paused: 'PAUSED'
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
const game = {
  status: status.menu,
  best: 0
}

function setListener () {
  window.addEventListener('keydown', (e) => {
    player.movement = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key) && game.status === status.playing
      ? e.key
      : player.movement
    if (e.key.includes('Escape') && game.status !== status.menu) {
      game.status = game.status === status.playing ? game.status = status.paused : game.status = status.playing
    } else if (e.key.includes('Enter')) {
      game.status = status.playing
      player.reset(20)
      fruit.spawn(player.body)
    }
  })
};

function resetGame () {
  game.best = player.points > (game.best || 0) ? player.points : game.best
  game.status = status.menu
  if (player.points !== undefined) {
    document.getElementById('menu').innerHTML = 'Points: ' + player.points + ' (Best: ' + game.best + ')<br>Press ENTER to start a new game'
  }
}

function startGame () {
  setListener()
  resetGame()
  setInterval(() => {
    if (game.status.includes(status.playing)) {
      movePlayer()
      setPosition()
      checkCollisions()
    }
    render()
  }, 50)
};

function render () {
  document.getElementById('paused').className = game.status === status.paused ? 'paused' : 'hidden'
  document.getElementById('menu').className = game.status === status.menu ? 'paused' : 'hidden'
  pointDOM.innerText = player.points || '0'
  bestDOM.innerText = game.best || '0'
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.beginPath()
  ctx.fillStyle = color.green
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  if (game.status === status.playing) {
    ctx.fillStyle = color.red
    ctx.strokeStyle = color.darkred
    ctx.arc(fruit.position.x * chunk + chunk / 2, fruit.position.y * chunk + chunk / 2, chunk / 3, 0, 2 * Math.PI, false)
    ctx.fill()

    player.body.forEach((coordenate) => {
      ctx.fillStyle = color.yellow
      ctx.fillRect(coordenate.x * chunk, coordenate.y * chunk, chunk, chunk)
      ctx.stroke()
    })
  }
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
