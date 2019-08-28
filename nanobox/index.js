"use strict";

// Engine options object, and engine instantiation:
import Engine from "noa-engine";

// NPPB requires the class BABYLON (legacy)
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

// Voxel Crunch
var voxelCrunch = require("voxel-crunch");

var opts = {
    debug: true,
    showFPS: true,
    chunkSize: 32,
    chunkAddDistance: 2.5,
    chunkRemoveDistance: 3.5,
	playerAutoStep: true
}
var noa = new Engine(opts)

// Loading plugins (noa-plus-plugins)
var nppb = new NoaPlusPlugins(noa, BABYLON);

var noaTerrainGen = new NoaTerrainGen(nppb);
nppb.addPlugin(noaTerrainGen);
noaTerrainGen.setTerrainGenType("simplex");

var noaChunkSave = new NoaChunkSave(nppb, voxelCrunch);
nppb.addPlugin(noaChunkSave);

var noaEnvironment = new NoaEnvironment(nppb, "textures/clouds.png");
nppb.addPlugin(noaEnvironment);
noaEnvironment.setCloudOptions(1, new BABYLON.Color3(1, 1, 1), 100);

// Block materials
noa.registry.registerMaterial("dirt", null, "textures/dirt.png");
noa.registry.registerMaterial("grass_top", null, "textures/grass_top.png");
noa.registry.registerMaterial("grass_side", null, "textures/grass_side.png");
noa.registry.registerMaterial("stone", null, "textures/stone.png");

// Block types
var dirtID = nppb.registerBlock(1, { material: "dirt" }, {});
var grassID = nppb.registerBlock(2, { material: ["grass_top", "dirt", "grass_side"] }, {});
var stoneID = nppb.registerBlock(3, { material: "stone" }, {});

// chunkBeingRemoved Event
noa.world.on("chunkBeingRemoved", function(id, array, userData) {
    noaChunkSave.chunkSave(id, array);
});


// worldDataNeeded Event
noa.world.on("worldDataNeeded", function (id, data, x, y, z) {
	if (noaChunkSave.isChunkSaved(id)) {
		data = noaChunkSave.chunkLoad(id, data);
	} else {
		data = noaTerrainGen.genTerrain(id, data, x, y, z, [grassID, dirtID, stoneID]);
	}
    // Tell noa the chunk's terrain data is now set
    noa.world.setChunkData(id, data);
});

// Get the player entity's ID and other info (position, size, ..)
var player = noa.playerEntity;
var dat = noa.entities.getPositionData(player);
var w = dat.width;
var h = dat.height;


// Add a mesh to represent the player, and scale it, etc.
var scene = noa.rendering.getScene();
var mesh = BABYLON.Mesh.CreateBox("player-mesh", 1, scene);
mesh.scaling.x = w;
mesh.scaling.z = w;
mesh.scaling.y = h;


// Add "mesh" component to the player entity
// This causes the mesh to move around in sync with the player entity
noa.entities.addComponent(player, noa.entities.names.mesh, {
    mesh: mesh,
    /* Offset vector is needed because noa positions are always the 
	   bottom-center of the entity, and Babylon"s CreateBox gives a 
	   mesh registered at the center of the box */
    offset: [0, h / 2, 0]
});

// Clear targeted block on on left click
noa.inputs.down.on("fire", function () {
    if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
})

// Place some grass on right click
noa.inputs.down.on("alt-fire", function () {
    if (noa.targetedBlock) noa.addBlock(stoneID, noa.targetedBlock.adjacent);
})

// Ran each tick
noa.on("tick", function (dt) {

});