var renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x1099bb})
document.body.appendChild(renderer.view)

// create the root of the scene graph
var stage = new PIXI.Container()

// create a texture from an image path
var texture = PIXI.Texture.fromImage('../img/player.png')

var map = new Map

var socket = io('http://localhost')

var myPlayer

socket.on('whoami', function (playerId) {
  myPlayer = map.getPlayer(playerId)
})

socket.on('updates', function (updates) {
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

for (var i = 0; i < 7; ++i) {
  var row = []
  posX = 0
  for (var j = 0; j < 7; ++j) {

    var soldier = new PIXI.Sprite(texture)

    // center the sprite's anchor point
    soldier.anchor.x = posX
    soldier.anchor.y = posY

    // move the sprite to the center of the screen
    soldier.position.x = 0
    soldier.position.y = 0

    stage.addChild(soldier)

    row.push(soldier)
    --posX
  }
  matrix.push(row)
  --posY
}

var debug = true

var keyboard = new KeyboardJS(debug)
// start animating
animate();

function move (direction) {
  socket.emit('direction', direction)
}

function animate() {

  if (myPlayer == undefined) return

  var position = myPlayer.getPositionObject()
  var x = position.x
  var y = position.y

  if (keyboard.char('W') || keyboard.keys[38]) {
    move(util.direction.UP)
  } else if(keyboard.char('A') || keyboard.keys[37]) {
    move(util.direction.LEFT)
  } else if(keyboard.char('D') || keyboard.keys[39]) {
    move(util.direction.RIGHT)
  } else if(keyboard.char('S') || keyboard.keys[40]) {
    move(util.direction.DOWN)
  }

  for(var i = y-3; i <= y+3; ++i) {
    for(var j = x-3; j <= x+3; ++j) {
      /*
      var cell = map.getCellAt(j, i)
      var playerId = cell.getPlayerId()
      */
      var sprite = matrix[-(y-3)+i][-(x-3)+j]
      if(/*playerId*/ Math.random() > 0.5) {
        sprite.alpha = 1
      } else {
        sprite.alpha = 0
      }
    }
  }

  requestAnimationFrame(animate)
  renderer.render(stage)
}
