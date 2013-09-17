var rescue = require('./')
var voxel = require('voxel')
var engine = require('voxel-engine')
var texturePath = require('painterly-textures')(__dirname)

var settings = {
    generate: voxel.generator['Valley'],
    chunkDistance: 2,
    materials: [
    ['grass', 'dirt', 'grass_dirt'],
    'obsidian',
    'brick',
    'grass'
    ],
    texturePath: texturePath,
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true },
   avatarInitialPosition: [2, 20, 2]
}

var game = engine(settings);

var rescuer = rescue(game, {
  frequency: 100
});

// for debugging
window.game = game
