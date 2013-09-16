/*jshint asi:true */

var inherits = require('inherits')
var events = require('events')
var _ = require('underscore')

module.exports = function(game, object, opts) {
  return new Rescuer(game, object, opts)
}

// Default option values
var DEFAULT_FREQ = 500
var DEFAULT_DANGER_ZONE = {
  lower: {x: -Infinity, y: -Infinity, z: -Infinity},
  upper: {x: Infinity, y: -200, z: Infinity}
}

function Rescuer(game, object, opts) {
  if (!opts) opts = {}
  this.opts = opts
  this.game = game
  this.object = object
  this.game.on('tick', _.throttle(this.checkPosition.bind(this), this.opts.frequency || DEFAULT_FREQ))
}

inherits(Rescuer, events.EventEmitter)

Rescuer.prototype.checkPosition = function() {
  var dangerZone = this.opts.dangerZone || DEFAULT_DANGER_ZONE
  var currentPos = game.controls._target.avatar.position

  if (currentPos.x < dangerZone.upper.x)
  if (currentPos.y < dangerZone.upper.y)
  if (currentPos.z < dangerZone.upper.z)
  if (currentPos.x > dangerZone.lower.x)
  if (currentPos.y > dangerZone.lower.y)
  if (currentPos.z > dangerZone.lower.z) {
    this.rescue(currentPos.clone())
  }
}

Rescuer.prototype.rescue = function(position) {
  if(this.opts.teleport !== false) {
    // Default to starting position for rescue point
    this.object.yaw.position.copy(this.opts.position || this.game.startingPosition)
  }
  this.emit('rescue', position)
}
