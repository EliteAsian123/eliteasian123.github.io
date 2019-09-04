/*!
 * Desertic by: EliteAsian123
 * 
 * Copyright © 2019 EliteAsian123
 *
*/

///////////////////////
// Declaring objects //
///////////////////////

var tools = {
	hands: {name: "hands", incorrectToolEfficiency: 0.15, correctToolEfficiency: 0.5},
	rocks: {name: "rocks", incorrectToolEfficiency: 0.25, correctToolEfficiency: 0.65},
	pickaxe: {name: "pickaxe", incorrectToolEfficiency: 0.45, correctToolEfficiency: 1.5},
	shovel: {name: "shovel", incorrectToolEfficiency: 0.2, correctToolEfficiency: 0.95},
	cactus_saw: {name: "cactus_saw", incorrectToolEfficiency: 0.35, correctToolEfficiency: 0.65}
};

var items = {
	item_pickaxe: {name: "Pickaxe", tool: tools.pickaxe, texture: "textures/crude_pickaxe.png"},
	item_shovel: {name: "Shovel", tool: tools.shovel, texture: "textures/shovel.png"},
	item_cactus_saw: {name: "Cactus Saw", tool: tools.cactus_saw, texture: "textures/crude_cactus_saw.png"},
	item_twine: {name: "Twine", tool: tools.hands, texture: "textures/twine.png"},
	item_rocks: {name: "Rocks", tool: tools.rocks, texture: "textures/rocks.png"},
	item_stick: {name: "Stick", tool: tools.hands, texture: "textures/stick.png"}
};

var materials = [
	{name: "dry_dirt", color: null, texture: "textures/dry_dirt.png"},
	{name: "sand", color: null, texture: "textures/sand.png"},
	{name: "stone", color: null, texture: "textures/stone.png"},
	{name: "cactus_side", color: null, texture: "textures/cactus_side.png"},
	{name: "cactus_top", color: null, texture: "textures/cactus_top.png"},
	{name: "cactus_bottom", color: null, texture: "textures/cactus_bottom.png"}
];

var blocks = {
	dry_dirt: {name: "dry_dirt", material: "dry_dirt", hardness: 3, tool: ["hands", "shovel", "rocks"]},
	sand: {name: "sand", material: "sand", hardness: 2.8, tool: ["hands", "shovel", "rocks"]},
	stone: {name: "stone", material: "stone", hardness: 10, tool: ["pickaxe"]},
	cactus_top: {name: "cactus_top", material: ["cactus_top", "cactus_bottom", "cactus_side"], hardness: 3, tool: ["cactus_saw"]},
	cactus_bottom: {name: "cactus_bottom", material: ["cactus_bottom", "cactus_bottom", "cactus_side"], hardness: 3, tool: ["cactus_saw"]}
};

/////////////////
// Actual game //
/////////////////

// Engine options object, and engine instantiation:
import Engine from "noa-engine";

// NPPB requires the class BABYLON (legacy)
import * as BABYLON from "@babylonjs/core/Legacy/legacy";

// Voxel Crunch
var voxelCrunch = require("voxel-crunch");

// Murmur Numbers
var hash = require("murmur-numbers");

// GL Vector3
var glvec3 = require("gl-vec3");

// Load game engine
var opts = {
    debug: true,
    showFPS: true,
    chunkSize: 32,
    chunkAddDistance: 2.5,
    chunkRemoveDistance: 3.5,
	playerAutoStep: true
};
var noa = new Engine(opts);

// Setup player properties
var playerMovementState = noa.entities.getMovement(noa.playerEntity);
playerMovementState.airJumps = 0;
playerMovementState.maxSpeed = 8.5;
playerMovementState.jumpImpulse = 7;
playerMovementState.jumpTime = 150;

// Loading plugins (noa-plus-plugins) and variables
var nppb = new NoaPlusPlugins(noa, BABYLON);

var seed = Math.random();

var itemBarElement = document.getElementById("itemBar");
var itemBarContext = itemBarElement.getContext("2d");
itemBarContext.imageSmoothingEnabled = false;
var itemBarImage = new Image();
itemBarImage.src = "textures/item_bar.png";
var itemBarImageSelection = new Image();
itemBarImageSelection.src = "textures/item_bar_selection.png";
 
var noaChunkSave = new NoaChunkSave(nppb, voxelCrunch);
nppb.addPlugin(noaChunkSave);

var noaEnvironment = new NoaEnvironment(nppb, "textures/clouds.png");
nppb.addPlugin(noaEnvironment);
noaEnvironment.setCloudOptions(0.35, new BABYLON.Color4(1, 1, 1), 250);

var texturesArray = [
	"textures/break_decal_0.png",
	"textures/break_decal_1.png",
	"textures/break_decal_2.png",
	"textures/break_decal_3.png",
	"textures/break_decal_4.png",
	"textures/break_decal_5.png",
	"textures/break_decal_6.png",
	"textures/break_decal_7.png"
];
var noaBlockBreak = new NoaBlockBreak(nppb, glvec3, texturesArray);
nppb.addPlugin(noaBlockBreak);

// Block materials
for (var i of materials) {
	noa.registry.registerMaterial(i.name, i.color, i.texture);
}

// Block types and Block items
var currentID = 0;
for (var i of Object.keys(blocks)) {
	nppb.registerBlock(++currentID, { material: blocks[i].material }, { hardness: blocks[i].hardness, tool: blocks[i].tool });
	items["block_" + i] = {name: blocks[i].name, tool: tools.hands, texture: "textures/" + blocks[i].name + ".png"};
	blocks[i] = currentID;
	items["block_" + i].placeBlock = currentID;
}

// Get item images
for (var i of Object.keys(items)) {
	var j = new Image();
	j.src = items[i].texture;
	items[i].texture = j;
}

// Resource generation options
var genResources = [
	//{block: blocks.dirt, chance: 0.05, minAmount: 2, maxAmount: 10, minY: -5, maxY: 3, inBlock: blocks.dry_dirt}
];

// Set itemBar items
var itemBarItems = [ 
	items.item_pickaxe,
	items.item_shovel,
	items.block_sand,
	items.block_dry_dirt,
	items.block_stone
];
var itemBarSelection = 0;

// chunkBeingRemoved Event
noa.world.on("chunkBeingRemoved", function(id, array, userData) {
    noaChunkSave.chunkSave(id, array);
});


// worldDataNeeded Event
noa.world.on("worldDataNeeded", function(id, data, x, y, z) {
	if (noaChunkSave.isChunkSaved(id)) {
		data = noaChunkSave.chunkLoad(id, data);
	} else {
		for (var x1 = 0; x1 < data.shape[0]; ++x1) {
				for (var z1 = 0; z1 < data.shape[2]; ++z1) {
					for (var y1 = 0; y1 < data.shape[1]; ++y1) {
						// Create main land
						if (y1 + y === 1) {
							// Generate cactus
							if (hash(x1 + x, y1 + y, z1 + z, seed) < 0.001) {
								var cactusHeight = Math.floor(hash(x1 + x, y1 + y, z1 + z, seed, "cactus") * 2) + 3;
								console.log(cactusHeight);
								for (var i = 0; i < cactusHeight; i++) {
									data.set(x1, y1 + i, z1, blocks.cactus_bottom);
								}
								data.set(x1, y1 + cactusHeight, z1, blocks.cactus_top);
							} 
							
						} else if (y1 + y < 1 && y1 + y > -5) {
							data.set(x1, y1, z1, blocks.sand);
						} else if (y1 + y <= -5) {
							data.set(x1, y1, z1, blocks.stone);
						}

						// Generate random resources
						for (var i of genResources) {
							if (data.get(x1, y1, z1) === i.inBlock) {
								if (y1 + y <= i.maxY && y1 + y >= i.minY) {
									if (hash(x1 + x, y1 + y, z1 + z, seed) < i.chance) {
										data.set(x1, y1, z1, i.block);
									}
								}
							}
						}
					}
				}
			}
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

// Breaks blocks on fire down
noa.inputs.bind("fire", "Q");
noa.inputs.down.on("fire", function() {
    //if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
	noaBlockBreak.fireDown();
});

noa.inputs.up.on("fire", function() {
	noaBlockBreak.fireUp();
});

// Place some grass on right click
noa.inputs.down.on("alt-fire", function() {
	if (noa.targetedBlock) {
		if (itemBarItems[itemBarSelection] !== null) {
			if (itemBarItems[itemBarSelection].placeBlock !== null) {
				noa.addBlock(itemBarItems[itemBarSelection].placeBlock, noa.targetedBlock.adjacent);
			}
		}
	}
})

// Ran each tick
noa.on("tick", function(dt) {
	// Handle item scrolling
	var scroll = noa.inputs.state.scrolly;
    if (scroll !== 0) {
        itemBarSelection += (scroll > 0) ? 1 : -1;
        if (itemBarSelection < 0) itemBarSelection = 4;
        if (itemBarSelection > 4) itemBarSelection = 0;
    }
});

// Item bar slots
for (var i = 1; i < 6; i++) {
	noa.inputs.bind("slot" + i, i.toString());
}
noa.inputs.down.on("slot1", function() {
	itemBarSelection = 0;
});
noa.inputs.down.on("slot2", function() {
	itemBarSelection = 1;
});
noa.inputs.down.on("slot3", function() {
	itemBarSelection = 2;
});
noa.inputs.down.on("slot4", function() {
	itemBarSelection = 3;
});
noa.inputs.down.on("slot5", function() {
	itemBarSelection = 4;
});


// Ran before every frame
noa.on('beforeRender', function(dt) {
	// Move clouds
	noaEnvironment.moveClouds(dt / 500000, dt / 1000000);
	
	// Handle block breaking
	if (noa.targetedBlock) {
		var neededTool = nppb.getBlockCustomOptions(noa.targetedBlock.blockID, "tool");
		var correct = false;
		var itemTool = itemBarItems[itemBarSelection];
		if (itemTool === null) {
			itemTool = tools.hands;
		} else {
			itemTool = itemTool.tool;
		}
		for (var i of neededTool) {
			if (i === itemTool.name) {
				correct = true;
				break;
			}
		}
		if (correct) {
			noaBlockBreak.render(dt, itemTool.correctToolEfficiency);
		} else {
			noaBlockBreak.render(dt, itemTool.incorrectToolEfficiency);
		}
	}
	
	// Handle itemBar drawing
	itemBarContext.clearRect(0, 0, itemBarElement.width, itemBarElement.height);
	itemBarContext.drawImage(itemBarImage, 0, 0, itemBarElement.width, itemBarElement.height);
	itemBarContext.drawImage(itemBarImageSelection, (itemBarSelection * 72) + 8, 8, 72, 72);
	for (var i = 0; i < itemBarItems.length; i++) {
		if (itemBarItems[i] !== null) {
			itemBarContext.drawImage(itemBarItems[i].texture, (i * 72) + 12, 12, 64, 64);
		}
	}
});
