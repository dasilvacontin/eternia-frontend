'use strict'

//var util = require('./util')

function Cell (cellId) {
  this.id = cellId
  this.playerId = undefined
  this.resource = undefined
}

Cell.prototype.isAvailable = function () {
  return !this.playerId
}

Cell.prototype.getPositionObject = function () {
  return util.getPositionFromId(this.id)
}

Cell.prototype.getId = function () {
  return this.id
}

Cell.prototype.setPlayerId = function (playerId) {
  this.playerId = playerId
}

Cell.prototype.getPlayerId = function () {
  return this.playerId
}

Cell.prototype.getResource = function() {
	return this.resource
}

module.exports = Cell
