/*jshint asi:true */

var inherits = require('inherits')
var events = require('events')
var _ = require('lodash')
var aabb = require('aabb-3d')

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

  var position = this.opts.startingPosition || this.game.startingPosition
  this.position = position

  //This rescue BB hurriedly loads the blocks below the player's spawn location
  //to avoid infinite falling.
  //Features a fudge factor to maybe play with.
  //It's how many blocks in the x/z dimensions to also load, to account for horizontal drift.
  var fudgeFactor = 5;
  this.rescueBB = aabb([position[0]+fudgeFactor, position[1]+fudgeFactor, position[2]+fudgeFactor], [position[0]-fudgeFactor, position[1]-200, position[2]-fudgeFactor])
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
  target.position.x = this.position[0];
  target.position.y = this.position[1];
  target.position.z = this.position[2];
  target.velocity.x = 0;
  target.velocity.y = 0;
  target.velocity.z = 0;

  this.game.spatial.emit('Respawning', this.rescueBB)
  this.game.spatial.emit('Reloading level', aabb([Infinity, Infinity, Infinity], [-Infinity, -Infinity, -Infinity]))

}