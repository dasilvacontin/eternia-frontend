var renderer = PIXI.autoDetectRenderer(800, 600,{backgroundColor : 0x23be78})
document.body.appendChild(renderer.view)

// create the root of the scene graph
var stage = new PIXI.Container()

// create a texture from an image path
var texture = PIXI.Texture.fromImage('../img/player.png')
var treeTexture = PIXI.Texture.fromImage('../img/tree.png')

var map = new Map

var socket = io('http://localhost:8080')

var myPlayer

socket.on('whoami', function (playerId) {
  console.log('whoami', playerId)
  myPlayer = map.getPlayer(playerId)
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
var treeMatrix = []

var DEPTH = 10

for (var i = 0; i < DEPTH*2+1; ++i) {
  var row = []
  var treeRow = []
  posX = 0
  for (var j = 0; j < DEPTH*2+1; ++j) {

    var soldier = new PIXI.Sprite(texture)
    var tree = new PIXI.Sprite(treeTexture)

    // center the sprite's anchor point
    soldier.anchor.x = posX
    soldier.anchor.y = posY

    tree.anchor.x = posX
    tree.anchor.y = posY

    // move the sprite to the center of the screen
    soldier.position.x = 0
    soldier.position.y = 0

    tree.position.x = 0
    tree.position.y = 0

    soldier.alpha = 0
    tree.alpha = 0

    stage.addChild(soldier)
    stage.addChild(tree)

    row.push(soldier)
    treeRow.push(tree)
    --posX
  }
  matrix.push(row)
  treeMatrix.push(treeRow)
  --posY
}

var debug = false
var keyboard = new KeyboardJS(debug)
// start animating
animate();

function move (direction) {
  console.log('move', direction)
  socket.emit('movePlayer', direction)
}

function attack (direction) {
  console.log('attack', direction)
  socket.emit('attackPlayer', direction)
}

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

  if (keyboard.char('I')) {
    attack(util.direction.UP)
  } else if (keyboard.char('L')) {
    attack(util.direction.RIGHT) 
  } else if (keyboard.char('K')) {
    attack(util.direction.DOWN) 
  } else if (keyboard.char('J')) {
    attack(util.direction.LEFT)
  }

  if (myPlayer == undefined) return

  var position = myPlayer.getPositionObject()
  if (!position) return
  var x = position.x
  var y = position.y

  for(var i = y-DEPTH; i <= y+DEPTH; ++i) {
    for(var j = x-DEPTH; j <= x+DEPTH; ++j) {
      var cell = map.getCellAt(j, i)
      var playerId = cell.getPlayerId()
      var resource = cell.getResource()
      var sprite = matrix[-(y-DEPTH)+i][-(x-DEPTH)+j]
      var treeSprite = treeMatrix[-(y-DEPTH)+i][-(x-DEPTH)+j]
      if(playerId) {
        sprite.alpha = 1
        treeSprite.alpha = 0
      } else if (resource) {
        sprite.alpha = 0
        treeSprite.alpha = 1
      } else {
        sprite.alpha = 0
        treeSprite.alpha = 0
      }
    }
  }
}
