/* globals BABYLON */
"use strict";

var noaEngine = require("noa-engine");

// Game engine settings
var opts = {
	debug: true,
	showFPS: true,
	inverseY: false,
	chunkSize: 16,
	chunkAddDistance: 4,
	chunkRemoveDistance: 4,
	blockTestDistance: 50,
	texturePath: "textures/",
	playerStart: [0.5, 6, 0.5],
	playerHeight: 1.6,
	playerWidth: 0.8,
	playerAutoStep: true,
	useAO: true,
	AOmultipliers: [0.92, 0.8, 0.5],
	reverseAOmultiplier: 1.0
};

// Create engine
var noa = noaEngine(opts);



// Register
// Register block materials
noa.registry.registerMaterial("dirt", null, "dirt.png");
noa.registry.registerMaterial("grass_top", null, "grass_top.png");
noa.registry.registerMaterial("grass_side", null, "grass_side.png");
noa.registry.registerMaterial("stone_bricks", null, "stone_bricks.png");

// Register blocks
var dirt = noa.registry.registerBlock(1, { material: "dirt" });
var grass = noa.registry.registerBlock(2, { material: ["grass_top", "dirt", "grass_side"] });
var stone_bricks = noa.registry.registerBlock(3, { material: "stone_bricks" });



// Terrain
// Add a listener for when the engine requests a new world chunk
noa.world.on("worldDataNeeded", function (id, data, x, y, z) {
	
	for (var x1 = 0; x1 < data.shape[0]; ++x1) {
		for (var z1 = 0; z1 < data.shape[2]; ++z1) {
			for (var y1 = 0; y1 < data.shape[1]; ++y1) {
				if (y1 + y === 5) {
					data.set(x1, y1, z1, grass);
				} else if (y1 + y < 5) {
					data.set(x1, y1, z1, dirt);
				}
			}
		}
	}
	// Pass the finished data back to the game engine
	noa.world.setChunkData(id, data);
})


// Add player mesh
// Get the player entity"s ID and other info (aabb, size)
var eid = noa.playerEntity;
var dat = noa.entities.getPositionData(eid);
var w = dat.width;
var h = dat.height;

// Make a Babylon.js mesh and scale it, etc.
var scene = noa.rendering.getScene();
var mesh = BABYLON.Mesh.CreateBox("player", 1, scene);
mesh.scaling.x = mesh.scaling.z = w;
mesh.scaling.y = h;

// Offset of mesh relative to the entity"s position (center of its feet)
var offset = [0, h / 2, 0];

// Add a mesh component to the player entity
noa.entities.addComponent(eid, noa.entities.names.mesh, {
	mesh: mesh,
	offset: offset
});



// Input
// On left mouse, set targeted block to be air
noa.inputs.down.on("fire", function () {
	if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
});

// On right mouse, place some grass
noa.inputs.down.on("alt-fire", function () {
	if (noa.targetedBlock) noa.addBlock(stone_bricks, noa.targetedBlock.adjacent);
});

// Each tick, consume any scroll events and use them to zoom camera
var zoom = 0
noa.on("tick", function (dt) {
	var scroll = noa.inputs.state.scrolly;
	if (scroll === 0) return;

	// Handle zoom controls
	zoom += (scroll > 0) ? 1 : -1;
	if (zoom < 0) zoom = 0;
	if (zoom > 10) zoom = 10
	noa.rendering.zoomDistance = zoom;
})