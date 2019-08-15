/* globals BABYLON */
"use strict";

var noaEngine = require("noa-engine");
var voxelCrunch = require("voxel-crunch");

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
	playerHeight: 1.9,
	playerWidth: 0.8,
	playerAutoStep: true,
	useAO: true,
	AOmultipliers: [0.92, 0.8, 0.5],
	reverseAOmultiplier: 1.0
};

// Create engine and important variables
var noa = noaEngine(opts);
var scene = noa.rendering.getScene();
var guiOpen = false;
var saveData = {};



// Register
// Register block materials
noa.registry.registerMaterial("dirt", null, "dirt.png");
noa.registry.registerMaterial("grass_top", null, "grass_top.png");
noa.registry.registerMaterial("grass_side", null, "grass_side.png");
noa.registry.registerMaterial("stone_bricks", null, "stone_bricks.png");
noa.registry.registerMaterial("planks", null, "planks.png");
noa.registry.registerMaterial("stone", null, "stone.png");
noa.registry.registerMaterial("glass", null, "glass.png", true);

// Register blocks
var dirt = noa.registry.registerBlock(1, { material: "dirt" });
var grass = noa.registry.registerBlock(2, { material: ["grass_top", "dirt", "grass_side"] });
var stone_bricks = noa.registry.registerBlock(3, { material: "stone_bricks" });
var planks = noa.registry.registerBlock(4, { material: "planks" });
var glass = noa.registry.registerBlock(5, { material: "glass", opaque: false });
var stone = noa.registry.registerBlock(6, { material: "stone" });

var blockArray = [stone_bricks, planks, glass, dirt, grass, stone];
var blockNameArray = ["stone_bricks", "planks", "glass", "dirt", "grass", "stone"];

var currentBlock = stone_bricks;



// Terrain
// When chunk is being removed, store it's data
noa.world.on('chunkBeingRemoved', function (id, array, userData) {
    //var encodedData = voxelCrunch.encode(array.data);
	saveData[id.toString()] = array.data;
});

// Add a listener for when the engine requests a new world chunk
noa.world.on("worldDataNeeded", function (id, data, x, y, z) {
	if (id.toString() in saveData) {
		//var decodedData = voxelCrunch.decode(saveData[id.toString()], []);
		data.data = saveData[id.toString()];
    } else {
		for (var x1 = 0; x1 < data.shape[0]; ++x1) {
			for (var z1 = 0; z1 < data.shape[2]; ++z1) {
				for (var y1 = 0; y1 < data.shape[1]; ++y1) {
					if (y1 + y === 5) {
						data.set(x1, y1, z1, grass);
					} else if (y1 + y < 5 && y1 + y > 0) {
						data.set(x1, y1, z1, dirt);
					} else if (y1 + y <= 0) {
						data.set(x1, y1, z1, stone);
					}	
				}
			}
		}
    }
	noa.world.setChunkData(id, data);	
})



// Add player mesh
// Get the player entity's ID and other info (aabb, size)
var playerEnt = noa.playerEntity;
var dat = noa.entities.getPositionData(playerEnt);
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
noa.entities.addComponent(playerEnt, noa.entities.names.mesh, {
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
	if (noa.targetedBlock) noa.addBlock(currentBlock, noa.targetedBlock.adjacent);
});

// Ran each tick
var blockArray_i = 0;
var blockImage = document.getElementById("block_img");
noa.on("tick", function (dt) {
	// Handle scrolling
	var scroll = noa.inputs.state.scrolly;
	if (scroll !== 0) {
		// Handle block switching
		blockArray_i += (scroll > 0) ? 1 : -1;
		if (blockArray_i < 0) blockArray_i = blockArray.length-1;
		if (blockArray_i > blockArray.length-1) blockArray_i = 0;
		currentBlock = blockArray[blockArray_i];
	
		// Handle block image switching
		blockImage.src = "textures/" + blockNameArray[blockArray_i] + "_icon.png";
	}
});