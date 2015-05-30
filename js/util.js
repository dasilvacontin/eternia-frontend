var util = {
  direction: {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
  }
}
util.getIncFromDirection = function (direction) {
  var inc = {x: 0, y:0}
  switch (direction) {

    case util.direction.UP:
      inc.y = -1
      break

    case util.direction.DOWN:
      inc.y = 1
      break

    case util.direction.LEFT:
      inc.x = -1
      break

    case util.direction.RIGHT:
      inc.x = 1
      break

  }
  return inc
}

util.getPositionFromId = function (id) {
  if (!id) {
    return
  }
  var coords = id.split('x')
  var pos = {
    x: Number(coords[0]),
    y: Number(coords[1])
  }
  return pos
}

util.updateObjectWithProps = function (obj, props) {
  for (var prop in props) {
    obj[prop] = props[prop]
  }
}

module.exports = util
