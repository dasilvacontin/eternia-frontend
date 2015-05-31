var playerTexture = PIXI.Texture.fromImage('../img/player.png')
var sleepyPlayerTexture = PIXI.Texture.fromImage('../img/player_zzz.png')
var pineTexture = PIXI.Texture.fromImage('../img/Pine.png')
var stoneTexture = PIXI.Texture.fromImage('../img/Rock.png')

function CellSprite() {
  PIXI.Container.call(this)

  this.cellSprite = new PIXI.Sprite(playerTexture)
  this.cellSprite.position.x = 0
  this.cellSprite.position.y = 0
  this.cellSprite.alpha = 0
  this.addChild(this.cellSprite)

  this.textSprite = new PIXI.Text("Yo")
  this.textSprite.position.x = 0
  this.textSprite.position.y = 1
  this.textSprite.alpha = 0
  this.textSprite.scale = {x: 0.3, y: 0.3}
  this.cellSprite.addChild(this.textSprite)

  this.energySprite = new PIXI.Text("HP: 70/100")
  this.energySprite.position.x = 0
  this.energySprite.position.y = 32
  this.energySprite.scale = {x: 0.3, y: 0.3}
  this.cellSprite.addChild(this.energySprite)
}

CellSprite.prototype = new PIXI.Container()

CellSprite.prototype.render = function(cell, player) {
  var hp
  var hpMax
  if (cell.playerId) {

    if (player.asleepSince) {
      this.cellSprite.texture = sleepyPlayerTexture
    } else {
      this.cellSprite.texture = playerTexture
    }
    this.cellSprite.alpha = 1
    this.textSprite.alpha = 1
    this.textSprite.text = player.username
    hp = player.hp
    hpMax = player.maxHP
    if(myPlayer && myPlayer.getId() == cell.playerId)
      this.textSprite.style = {fill: 'white'}
    else
      this.textSprite.style = {fill: 'black'}

  } else if (cell.resource) {

    var resource = cell.resource
    if (resource.type == "wood")
      this.cellSprite.texture = pineTexture
    else if (resource.type == "stone")
      this.cellSprite.texture = stoneTexture
    hp = resource.qty
    hpMax = resource.maxQty
    this.cellSprite.alpha = 1
    this.textSprite.alpha = 0

  } else {
    this.cellSprite.alpha = 0
  }
  this.energySprite.text = "HP: " + hp + "/" + hpMax
}
