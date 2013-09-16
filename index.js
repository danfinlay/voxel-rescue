/*jshint asi:true */

var inherits = require('inherits')
var events = require('events')
var _ = require('underscore')

module.exports = function(game, opts) {
  return new Rescuer(game, opts)
}

// Default option values
var DEFAULT_FREQ = 500
var DEFAULT_DANGER_ZONE = {
  lower: {x: -Infinity, y: -Infinity, z: -Infinity},
  upper: {x: Infinity, y: -200, z: Infinity}
}

function Rescuer(game, opts) {
  if (!opts) opts = {}
  this.opts = opts
  this.game = game
  this.game.on('tick', _.throttle(this.checkPosition.bind(this), this.opts.frequency || DEFAULT_FREQ))
}

inherits(Rescuer, events.EventEmitter)

Rescuer.prototype.checkPosition = function() {
  var dangerZone = this.opts.dangerZone || DEFAULT_DANGER_ZONE
  var currentPos = this.game.controls._target.position

  if(currentPos.x < dangerZone.upper.x &&
     currentPos.y < dangerZone.upper.y &&
     currentPos.z < dangerZone.upper.z &&
     currentPos.x > dangerZone.lower.x &&
     currentPos.y > dangerZone.lower.y &&
     currentPos.z > dangerZone.lower.z) {
    this.rescue(currentPos.clone())
  }
}

Rescuer.prototype.rescue = function(position) {

  console.log("It's true! teleporting to : "+JSON.stringify(this.opts.startingPosition || this.game.startingPosition));
  // Default to starting position for rescue point
  var target = this.game.controls.target();
  var respawnLocation = this.opts.startingPosition || this.game.startingPosition;
  target.position.x = respawnLocation[0];
  target.position.y = respawnLocation[1];
  target.position.z = respawnLocation[2];
 
  // this.game.emit('tick', delta)

  var playerPos = this.game.playerPosition()
  this.game.spatial.emit('position', respawnLocation, respawnLocation)

}