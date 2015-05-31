var playerTexture = PIXI.Texture.fromImage('../img/player.png')
var pineTexture = PIXI.Texture.fromImage('../img/Pine.png')
var stoneTexture = PIXI.Texture.fromImage('../img/Rock.png')

function CellSprite() {
  PIXI.Container.call(this)
  this.cellSprite = new PIXI.Sprite(playerTexture)
  this.cellSprite.position.x = 0
  this.cellSprite.position.y = 0
  this.cellSprite.alpha = 0
  this.addChild(this.cellSprite)
}

CellSprite.prototype = new PIXI.Container()

CellSprite.prototype.render = function(cell, player) {
  if (player) {
    this.cellSprite.texture = playerTexture
    this.cellSprite.alpha = 1
  } else if (cell.resource) {
    if (cell.resource.type == "wood")
      this.cellSprite.texture = pineTexture
    else if (cell.resource.type == "stone")
      this.cellSprite.texture = stoneTexture
    this.cellSprite.alpha = 1
  } else {
    this.cellSprite.alpha = 0
  }

}
