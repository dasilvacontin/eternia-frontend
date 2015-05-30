function Map () {
  this.cells = {}
  this.players = {}
}

Map.prototype.getCellAt = function getCellAt (x, y) {
  var cellId = x + 'x' + y
  return this.getCellWithId(cellId)
}

Map.prototype.getCellWithId = function (cellId) {
  var cell = this.cells[cellId]
  if (cell)
    return cell

  cell = new Cell ()
  this.cells[cellId] = cell
  return cell
}

Map.prototype.addPlayer = function (player) {
  var x = 0
  var cell
  while (cell = this.getCellAt(x, 0) && !cell.isAvailable())
    ++x

  this.setPlayerCell(player, cell)
  this.players[player.getId()] = player

  return cell
}

Map.prototype.setPlayerCell = function (player, cell) {
  var oldCellId = player.getCellId()
  if (oldCellId) {
    var oldCell = this.getCellWithId(oldCellId)
    oldCell.setPlayerId(undefined)
  }
  player.setCellId(cell.getId())
  cell.setPlayerId(player.getId())
}

Map.prototype.getPlayer = function (playerId) {
  return this.players[playerId]
}

Map.prototype.playerMoveDirection = function (player, direction) {
  var inc = util.getIncFromDirection(direction)
  var cell = this.getCellWithId(player.getCellId())
  var pos = cell.getPositionObject()
  var targetCell = this.getCellAt(pos.x + inc.x, pos.y + inc.y)
  if (!targetCell.isAvailable())
    return
  this.setPlayerCell(player, targetCell)
  // send updates to clients
}

module.exports = Map
