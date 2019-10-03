/*!
 * Desertic by: EliteAsian123
 * 
 * Copyright © 2019 EliteAsian123
 *
*/

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
	playerAutoStep: true,
	originRebaseDistance: 5
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

var updatingBlockLocations = [];

var itemBarElement = document.getElementById("itemBar");
var itemBarContext = itemBarElement.getContext("2d");
itemBarContext.imageSmoothingEnabled = false;
var itemBarImage = new Image();
itemBarImage.src = "textures/item_bar.png";
var itemBarImageSelection = new Image();
itemBarImageSelection.src = "textures/item_bar_selection.png";
var numbersImage = new Image();
numbersImage.src = "textures/numbers.png";

var currentUI = null;

var uiElement = document.getElementById("ui");
var uiContext = uiElement.getContext("2d");
uiElement.width = window.innerWidth;
uiElement.height = window.innerHeight;
uiContext.imageSmoothingEnabled = false;
showUI(false);
 
var noaChunkSave = new NoaChunkSave(nppb, voxelCrunch);
nppb.addPlugin(noaChunkSave);

var mouseX = 0;
var mouseY = 0;

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

// Adding listeners
window.addEventListener("keydown", keyDown);
window.addEventListener("resize", resize);
window.addEventListener("mousemove", move);
window.addEventListener("click", click, false);

// Block materials
for (var i of materials) {
	noa.registry.registerMaterial(i.name, i.color, i.texture);
}

// Block types and Block items
var currentID = 0;
for (var i of Object.keys(blocks)) {
	var j = { material: blocks[i].material };
	if (blocks[i].updatingBlock) {
		j['onSet'] = addUpdatingBlock;
		j['onLoad'] = addUpdatingBlock;
		j['onUnset'] = removeUpdatingBlock;
		j['onUnload'] = removeUpdatingBlock;
	}
	items["block_" + i] = { name: blocks[i].name, tool: tools.hands, texture: "textures/" + blocks[i].name + ".png" };
	nppb.registerBlock(++currentID, j, { name: blocks[i].name, hardness: blocks[i].hardness, tool: blocks[i].tool, drop: blocks[i].drop });
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
	items.item_crude_pickaxe,
	items.item_crude_shovel,
	items.item_crude_cactus_saw,
	null,
	items.block_sand
];
var itemBarItemsCount = [
	1,
	1,
	1,
	0,
	99
];
var itemBarSelection = 0;

var inventoryItems = [
	items.item_twine,
	items.item_rocks,
	items.item_stick,
	null,
	null,
	null,
	null,

	null,
	null,
	null,
	null,
	null,
	null,
	null
];
var inventoryItemsCount = [
	0,
	0,
	0,
	0,
	0,
	0,
	0,

	1,
	1,
	1,
	0,
	0,
	0,
	0
];
var heldItem = null;
var heldItemCount = 0;

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
var dat = noa.entities.getPositionData(noa.playerEntity);
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
noa.entities.addComponent(noa.playerEntity, noa.entities.names.mesh, {
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

// Place a block on right click
noa.inputs.down.on("alt-fire", function() {
	if (noa.targetedBlock) {
		if (itemBarItems[itemBarSelection] !== null) {
			if (itemBarItems[itemBarSelection].placeBlock !== null && itemBarItems[itemBarSelection].placeBlock) {
				noa.addBlock(itemBarItems[itemBarSelection].placeBlock, noa.targetedBlock.adjacent);
				itemBarItemsCount[itemBarSelection]--;
			}
		}
	}
});

// Ran each tick
noa.on("tick", function(dt) {
	// Handle item scrolling
	var scroll = noa.inputs.state.scrolly;
    if (scroll !== 0) {
        itemBarSelection += (scroll > 0) ? 1 : -1;
        if (itemBarSelection < 0) itemBarSelection = 4;
        if (itemBarSelection > 4) itemBarSelection = 0;
    }
	
	// Handle updating blocks
	for (var i of updatingBlockLocations) {
		var block = noa.getBlock(i[0], i[1], i[2]);
		var random = Math.random();
		switch(block) {
			case blocks.cactus_top:
				if (noa.getBlock(i[0], i[1] + 1, i[2]) !== 0) {
					noa.setBlock(blocks.cactus_bottom, i[0], i[1], i[2]);
				} else if (noa.getBlock(i[0], i[1] - 1, i[2]) === 0) {
					noa.setBlock(0, i[0], i[1], i[2]);
					addItem(items.block_cactus_top);
				} else {
					if (random <= 0.00001) {
						var j = 1;
						for (var k = 1; k < 5; k++) {
							if (noa.getBlock(i[0], i[1] - k, i[2]) === blocks.cactus_bottom) {
								j++;
							}
						}
					
						if (j < 5) {
							noa.setBlock(blocks.cactus_bottom, i[0], i[1], i[2]);
							noa.setBlock(blocks.cactus_top, i[0], i[1] + 1, i[2]);
						}
					}
				}
				
			break;
			
			case blocks.cactus_bottom:
				if (noa.getBlock(i[0], i[1] - 1, i[2]) === 0) {
					noa.setBlock(0, i[0], i[1], i[2]);
					addItem(items.block_cactus_top);
				} else {
					if (random <= 0.0001) {
						if (noa.getBlock(i[0], i[1] + 1, i[2]) === 0) {
							noa.setBlock(blocks.cactus_top, i[0], i[1], i[2]);
						}
					}
				}
			break;
		}
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
	// Handle block breaking
	if (noa.targetedBlock) {
		var neededTool = nppb.getBlockCustomOptions(noa.targetedBlock.blockID, "tool");
		var correct = false;
		var itemTool = itemBarItems[itemBarSelection];

		if (itemTool === null) {
			itemTool = tools.hands;
		} else {
			itemTool = tools[itemTool.tool];
		}

		if (!itemTool) {
			itemTool = tools.hands;
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
			if (itemBarItemsCount[i] > 1) {
				if (itemBarItemsCount[i] < 10) {
					itemBarContext.drawImage(numbersImage, (itemBarItemsCount[i] * 3), 0, 3, 6, (i * 72) + 12, 12, 3 * 4, 6 * 4);
				} else {
					itemBarContext.drawImage(numbersImage, (Math.floor(itemBarItemsCount[i] / 10) * 3), 0, 3, 6, (i * 72) + 12, 12, 3 * 4, 6 * 4);
					itemBarContext.drawImage(numbersImage, ((itemBarItemsCount[i] - Math.floor(itemBarItemsCount[i] / 10) * 10) * 3), 0, 3, 6, (i * 72) + 28, 12, 3 * 4, 6 * 4);
				}
			}
		}
	}

	// Handle UI drawing
	if (currentUI !== null) {
		uiContext.clearRect(0, 0, uiElement.width, uiElement.height);
		for (var i of currentUI) {
			var x = (uiElement.width / 2) - (i.width * 4 / 2) + i.x * 4;
			var y = (uiElement.height / 2) - (i.height * 4 / 2) + i.y * 4;
	
			switch (i.type) {
				case "image":
					var j = new Image();
					j.src = i.path;
					uiContext.drawImage(j, x, y, i.width * 4, i.height * 4);
					
					break;
	
				case "slot":
					var j = new Image();
					var num = 0;
					if (i.slotLoc === "itemBar") {
						var item = itemBarItems[i.slotNum];
						if (item !== null) {
							j = item.texture;
							num = itemBarItemsCount[i.slotNum];
						}
					} else if (i.slotLoc === "inventory") {
						var item = inventoryItems[i.slotNum];
						if (item !== null) {
							j = item.texture;
							num = inventoryItemsCount[i.slotNum];
						}
					} else {
						j.src = "textures/break_decal_7.png";
					}
					uiContext.drawImage(j, x, y, i.width * 4, i.height * 4);

					if (num > 1) {
						if (num < 10) {
							uiContext.drawImage(numbersImage, ((num - Math.floor(num / 10) * 10) * 3), 0, 3, 6, x, y, 3 * 4, 6 * 4);
						} else {
							uiContext.drawImage(numbersImage, (Math.floor(num / 10) * 3), 0, 3, 6, x, y, 3 * 4, 6 * 4);
							uiContext.drawImage(numbersImage, ((num - Math.floor(num / 10) * 10) * 3), 0, 3, 6, x + 16, y, 3 * 4, 6 * 4);
						}
					}
	
					break;
			}
		}
	}

	// Handle heldItem drawing
	if (heldItem !== null) {
		uiContext.drawImage(heldItem.texture, mouseX - 32, mouseY - 32, 64, 64);
		if (heldItemCount > 1) {
			if (heldItemCount < 10) {
				uiContext.drawImage(numbersImage, ((heldItemCount - Math.floor(heldItemCount / 10) * 10) * 3), 0, 3, 6, mouseX - 32, mouseY - 32, 3 * 4, 6 * 4);
			} else {
				uiContext.drawImage(numbersImage, (Math.floor(heldItemCount / 10) * 3), 0, 3, 6, mouseX - 32, mouseY - 32, 3 * 4, 6 * 4);
				uiContext.drawImage(numbersImage, ((heldItemCount - Math.floor(heldItemCount / 10) * 10) * 3), 0, 3, 6, mouseX - 16, mouseY - 32, 3 * 4, 6 * 4);
			}
		}
	}

	// Handle item removal
	for (var i = 0; i < inventoryItemsCount.length; i++) {
		if (inventoryItemsCount[i] < 1) {
			inventoryItems[i] = null;
		}
	}

	for (var i = 0; i < itemBarItemsCount.length; i++) {
		if (itemBarItemsCount[i] < 1) {
			itemBarItems[i] = null;
		}
	}
});

// Functions

function addUpdatingBlock(x, y, z) {
	updatingBlockLocations.push([x, y, z]);
}

function removeUpdatingBlock(x, y, z) {
	updatingBlockLocations = updatingBlockLocations.filter(word => word.equals([x, y, z]) === false);
}

function showUI(arg) {
	if (!arg) {
		uiElement.style.display = "none";
	} else {
		uiElement.style.display = "block";
	}
}

function keyDown(event) {
	if (event.keyCode === 9) {
		event.preventDefault();
		if (currentUI === null) {
			currentUI = uis.inventory;
			showUI(true);
			noa.container.setPointerLock(false);
			noa.entities.removeComponent(noa.playerEntity, noa.ents.names.receivesInputs);
		} else {
			currentUI = null;
			showUI(false);
			noa.container.setPointerLock(true);
			noa.entities.addComponent(noa.playerEntity, noa.ents.names.receivesInputs);
		}
	}
}

function click(event) {
	if (currentUI !== null) {
		var mousePos = getMousePos(event);

		for (var i of currentUI) {
			var x = (uiElement.width / 2) - (i.width * 4 / 2) + i.x * 4;
			var y = (uiElement.height / 2) - (i.height * 4 / 2) + i.y * 4;

			switch (i.type) {
				case "slot":
					if (isInsideRect(mousePos, x, y, i.width, i.height)) {
						if (i.slotLoc === "itemBar") {
							if (heldItem === null) {
								heldItem = itemBarItems[i.slotNum];
								heldItemCount = itemBarItemsCount[i.slotNum];
								itemBarItems[i.slotNum] = null;
								itemBarItemsCount[i.slotNum] = 0;
							} else {
								if (itemBarItems[i.slotNum] === null) {
									itemBarItems[i.slotNum] = heldItem;
									itemBarItemsCount[i.slotNum] = heldItemCount;
									heldItem = null;
									heldItemCount = 0;
								} else {
									if (itemBarItems[i.slotNum] === heldItem) {
										var finishingAmount = itemBarItemsCount[i.slotNum] + heldItemCount;
										if (finishingAmount > 99) {
											itemBarItemsCount[i.slotNum] = 99;
											heldItemCount = finishingAmount - 99;
										} else {
											itemBarItemsCount[i.slotNum] = finishingAmount;
											heldItem = null;
											heldItemCount = 0;
										}
									} else {
										var temp1 = heldItem;
										var temp2 = heldItemCount;
										heldItem = itemBarItems[i.slotNum];
										heldItemCount = itemBarItemsCount[i.slotNum];
										itemBarItems[i.slotNum] = temp1;
										itemBarItemsCount[i.slotNum] = temp2;
									}
								}
							}
						} else if (i.slotLoc === "inventory") {
							if (heldItem === null) {
								heldItem = inventoryItems[i.slotNum];
								heldItemCount = inventoryItemsCount[i.slotNum];
								inventoryItems[i.slotNum] = null;
								inventoryItemsCount[i.slotNum] = 0;
							} else {
								if (inventoryItems[i.slotNum] === null) {
									inventoryItems[i.slotNum] = heldItem;
									inventoryItemsCount[i.slotNum] = heldItemCount;
									heldItem = null;
									heldItemCount = 0;
								} else {
									if (inventoryItems[i.slotNum] === heldItem) {
										var finishingAmount = inventoryItemsCount[i.slotNum] + heldItemCount;
										if (finishingAmount > 99) {
											inventoryItemsCount[i.slotNum] = 99;
											heldItemCount = finishingAmount - 99;
										} else {
											inventoryItemsCount[i.slotNum] = finishingAmount;
											heldItem = null;
											heldItemCount = 0;
										}
									} else {
										var temp1 = heldItem;
										var temp2 = heldItemCount;
										heldItem = inventoryItems[i.slotNum];
										heldItemCount = inventoryItemsCount[i.slotNum];
										inventoryItems[i.slotNum] = temp1;
										inventoryItemsCount[i.slotNum] = temp2;
									}
								}
							}
						}
					}

					break;

				case "trash":
					if (isInsideRect(mousePos, x, y, i.width, i.height)) {
						if (heldItem !== null) {
							heldItem = null;
						}
					}
					
					break;
			}
		}
	}
}

function resize() {
	uiElement.width = window.innerWidth;
	uiElement.height = window.innerHeight;
	uiContext.imageSmoothingEnabled = false;
}

function isInsideRect(pos, x, y, w, h){
	return pos.x > x && pos.x < x + w * 4 && pos.y < y + h * 4 && pos.y > y;
}

function getMousePos(event) {
    var rect = uiElement.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
}

function move(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function addItem(item) {
	var j = itemInInventory(item);
	var k = false;

	for (var i = 0; i < itemBarItems.length; i++) {
		if (j === true) {
			if (itemBarItems[i] === item && itemBarItemsCount[i] < 99) {
				k = true;
				itemBarItemsCount[i]++;
				break;
			}
		} else {
			if (itemBarItems[i] === null) {
				k = true;
				itemBarItems[i] = item;
				itemBarItemsCount[i] = 1;
				break;
			}
		}
	}
	
	if (k === false) {
		for (var i = 0; i < inventoryItems.length; i++) {
			if (j === true) {
				if (inventoryItems[i] === item && inventoryItemsCount[i] < 99) {
					inventoryItemsCount[i]++;
					break;
				}
			} else {
				if (inventoryItems[i] === null) {
					inventoryItems[i] = item;
					inventoryItemsCount[i] = 1;
					break;
				}
			}
		}
	}
}

function itemInInventory(item) {
	var out = false;

	for (var i = 0; i < itemBarItems.length; i++) {
		if (itemBarItems[i] === item && itemBarItemsCount[i] < 99) {
			out = true;
			break;
		}
	}

	if (out === false) {
		for (var i = 0; i < inventoryItems.length; i++) {
			if (inventoryItems[i] === item && inventoryItemsCount[i] < 99) {
				out = true;
				break;
			}
		}
	}
	
	return out;
}

function onBlockBreak(block) {
	var drop = nppb.getBlockCustomOptions(block, "drop");
	if (drop) {
		addItem(items[drop]);
	} else {
		addItem(items["block_" + nppb.getBlockCustomOptions(block, "name")]);
	}
}
noaBlockBreak.addHook(onBlockBreak);