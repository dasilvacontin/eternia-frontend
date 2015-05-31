var zoom = 1.3
var renderer = PIXI.autoDetectRenderer(544*zoom, 544*zoom,{backgroundColor : 0x23be78})
document.body.appendChild(renderer.view)

// create the root of the scene graph
var stage = new PIXI.Container()
stage.scale.x = stage.scale.y = zoom

// create a texture from an image path
var texture = PIXI.Texture.fromImage('../img/player.png')
var treeTexture = PIXI.Texture.fromImage('../img/tree.png')

var map = new Map

var socket = io('http://kipos.me:8080')

var myPlayer

socket.on('connect', function() {
  var token = localStorage['token']
  var username
  if (!token) {
    username = prompt("Yo, what's your username?")
  }
  socket.emit('hello', username, token)
  socket.on('failedLogin', function () {
    delete localStorage['token']
    alert('Failed login. Refresh')
  })
})

socket.on('whoami', function (playerId, token) {
  console.log('whoami', playerId, token)
  myPlayer = map.getPlayer(playerId)
  localStorage['token'] = token
})

socket.on('updates', function (updates) {
  console.log('updates', updates)
  var cells = updates.cells
  var players = updates.players

  for (var cellId in cells) {
    var serverCell = cells[cellId]
    var cell = map.getCellWithId(cellId)
    util.updateObjectWithProps(cell, serverCell)
  }

  for (var playerId in players) {
    var serverPlayer = players[playerId]
    var player = map.getPlayer(playerId)
    util.updateObjectWithProps(player, serverPlayer)
  }
})

var posX = 0
var posY = 0
var matrix = []

var DEPTH = 8

for (var i = 0; i < DEPTH*2+1; ++i) {
  var row = []
  posX = 0
  for (var j = 0; j < DEPTH*2+1; ++j) {

    var cellSprite = new CellSprite

    cellSprite.position.x = posX
    cellSprite.position.y = posY

    stage.addChild(cellSprite)

    row.push(cellSprite)
    posX += 32
  }
  matrix.push(row)
  posY += 32
}

var debug = false
var keyboard = new KeyboardJS(debug)
// start animating
animate();

function move (direction) {
  socket.emit('movePlayer', direction)
}

function attack (direction, building) {
  if (building === undefined) {
    console.log('attack', direction)
    socket.emit('attackPlayer', direction)
  } else {
    console.log('build', building, direction)
    socket.emit('build', building, direction)
  }
}

var HOUSE = 0
var FENCE = 1
var GATE = 2

function animate() {
  requestAnimationFrame(animate)
  renderer.render(stage)


  if (keyboard.char('W') || keyboard.keys[38]) {
    move(util.direction.UP)
  } else if(keyboard.char('D') || keyboard.keys[39]) {
    move(util.direction.RIGHT)
  } else if(keyboard.char('S') || keyboard.keys[40]) {
    move(util.direction.DOWN)
  } else if(keyboard.char('A') || keyboard.keys[37]) {
    move(util.direction.LEFT)
  }

  var building = undefined
  if (keyboard.char('F')) {
    console.log('FENCE')
    building = FENCE
  } else if (keyboard.char('H')) {
    console.log('HOUSE')
    building = HOUSE
  } else if(keyboard.char('G')) {
    console.log('GATE')
    building = GATE
  }

  if (keyboard.char('I')) {
    attack(util.direction.UP, building)
  } else if (keyboard.char('L')) {
    attack(util.direction.RIGHT, building)
  } else if (keyboard.char('K')) {
    attack(util.direction.DOWN, building)
  } else if (keyboard.char('J')) {
    attack(util.direction.LEFT, building)
  }

  if (myPlayer == undefined) return

  var status = ""
  for (var type in myPlayer.resources) {
    status += type + ': ' + myPlayer.resources[type] + ', '
  }
  domResources.textContent = status

  var position = myPlayer.getPositionObject()
  if (!position) return
  var x = position.x
  var y = position.y

  for (var i = y-DEPTH; i <= y+DEPTH; ++i) {
    for (var j = x-DEPTH; j <= x+DEPTH; ++j) {
      var cell = map.getCellAt(j, i)
      var playerId = cell.getPlayerId()
      var sprite = matrix[-(y-DEPTH)+i][-(x-DEPTH)+j]
      var player = undefined
      if (playerId) {
        player = map.getPlayer(playerId)
      }
      sprite.render(cell, player)
    }
  }
}
