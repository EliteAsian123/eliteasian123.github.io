/* globals BABYLON */
"use strict";

var noaEngine = require("noa-engine");
var voxelCrunch = require("voxel-crunch");
var glvec3 = require("gl-vec3");

// Game engine settings
var opts = {
	debug: false,
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
var breakingBlock = null;
var guiCanvas = document.getElementById("gui");
var blockCustomProperties = [];
var breakingProgress = 0;
guiCanvas.width = window.innerWidth;
guiCanvas.height = window.innerHeight;

window.addEventListener("keydown", keydown);
guiCanvas.addEventListener("click", click, false);
window.addEventListener("resize", resize);

var guiContext = guiCanvas.getContext("2d");



// Register
// Register block materials
noa.registry.registerMaterial("dirt", null, "dirt.png");
noa.registry.registerMaterial("grass_top", null, "grass_top.png");
noa.registry.registerMaterial("grass_side", null, "grass_side.png");
noa.registry.registerMaterial("stone_bricks", null, "stone_bricks.png");
noa.registry.registerMaterial("planks", null, "planks.png");
noa.registry.registerMaterial("glass", null, "glass.png", true);
noa.registry.registerMaterial("stone", null, "stone.png");
noa.registry.registerMaterial("rusty_steel", null, "rusty_steel.png");
noa.registry.registerMaterial("future_block", null, "future_block.png");

// Register blocks
var dirt = registerBlock(1, { material: "dirt" }, { hardness: 2 });
var grass = registerBlock(2, { material: ["grass_top", "dirt", "grass_side"] }, { hardness: 2.1 });
var stone_bricks = registerBlock(3, { material: "stone_bricks" }, { hardness: 5 });
var planks = registerBlock(4, { material: "planks" }, { hardness: 3 });
var glass = registerBlock(5, { material: "glass", opaque: false }, { hardness: 2 });
var stone = registerBlock(6, { material: "stone" }, { hardness: 5 });
var rusty_steel = registerBlock(7, { material: "rusty_steel" }, { hardness: 8 });
var future_block = registerBlock(8, { material: "future_block" }, { hardness: 2 });

var blockArray = [stone_bricks, planks, glass, dirt, grass, stone, rusty_steel, future_block];
var blockNameArray = ["stone_bricks", "planks", "glass", "dirt", "grass", "stone", "rusty_steel", "future_block"];

var currentBlock = stone_bricks;

// Register guis
var gui_pause = [];
gui_pause.push({type: "button", x: 10, y: 10, w: 1900, h: 50, color: "lime", text: "Save", textS: "localStorage", func: save});
gui_pause.push({type: "button", x: 10, y: 70, w: 1900, h: 50, color: "red", text: "Reset World", func: resetWorld});

var currentGui = null;

// Make break decal variable
var breakDecalMesh;
renderBreakDecal();



// Load game
if (localStorage.getItem("world") !== null && localStorage.getItem("world") !== "empty") {
	var saveString = localStorage.getItem("world");
	saveString = LZString.decompress(saveString);
	saveString = JSON.parse(saveString);
	
	// Get object keys
	var saveStringKeys = Object.keys(saveString);
	
	// Convert any objects in the array into a array
	for (var element of saveStringKeys) {
		if (typeof saveString[element] !== Uint8Array) {
			saveString[element] = Object.keys(saveString[element]).map(function(key) {
				return saveString[element][key];
			});
		}
	}
	
	saveData = saveString;
}



// Terrain
// When chunk is being removed, store it's data
noa.world.on('chunkBeingRemoved', function(id, array, userData) {
    var encodedData = voxelCrunch.encode(array.data);
	saveData[id.toString()] = encodedData;
});

// Add a listener for when the engine requests a new world chunk
noa.world.on("worldDataNeeded", function(id, data, x, y, z) {
	if (id.toString() in saveData) {
		var decodedData = voxelCrunch.decode(saveData[id.toString()], new Uint32Array(data.data.length));
		data.data = decodedData;
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
});



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

// Offset of mesh relative to the entity's position (center of its feet)
var offset = [0, h / 2, 0];

// Add a mesh component to the player entity
noa.entities.addComponent(playerEnt, noa.entities.names.mesh, {
	mesh: mesh,
	offset: offset
});



// Input
// On left mouse, set breaking block
noa.inputs.down.on("fire", function() {
	if (noa.targetedBlock) {
		if (breakingBlock === null) {
			breakingBlock = noa.targetedBlock;
		}
	}
});

// On left mouse up, remove breaking block
noa.inputs.up.on("fire", function() {
	breakingBlock = null;
	breakingProgress = 0;
});

// On right mouse, place block
noa.inputs.down.on("alt-fire", function() {
	if (noa.targetedBlock) noa.addBlock(currentBlock, noa.targetedBlock.adjacent);
});

// On mid mouse, pick block
noa.inputs.down.on("mid-fire", function() {
	var i = 0;
	for (var element of blockArray) {
		if (element === noa.targetedBlock.blockID) {
			setPickedBlock(element, blockNameArray[i]);
			blockArray_i = i;
			break;
		}
		i++;
	}
});

// Debug
noa.inputs.bind("debug", "M");
noa.inputs.down.on("debug", function() {
	
});

// Ran each tick
var blockArray_i = 0;
var blockImage = document.getElementById("block_img");
noa.on("tick", function(dt) {
	// Handle scrolling
	var scroll = noa.inputs.state.scrolly;
	if (scroll !== 0) {
		// Handle block switching
		blockArray_i += (scroll > 0) ? 1 : -1;
		if (blockArray_i < 0) blockArray_i = blockArray.length-1;
		if (blockArray_i > blockArray.length-1) blockArray_i = 0;
		setPickedBlock(blockArray[blockArray_i], blockNameArray[blockArray_i]);
	}
	
	// Handle GUI drawing
	if (currentGui !== null) {
		guiContext.clearRect(0, 0, guiCanvas.width, guiCanvas.height);
		for (var i = 0; i < currentGui.length; ++i) {
			var element = currentGui[i];
			if (element.type === "button") {
				var text = element.text;
				if (element.textS !== "undefined") {
						switch (element.textS) {
							case "localStorage":
								// https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
								var _lsTotal=0,_xLen,_x;for(_x in localStorage){ if(!localStorage.hasOwnProperty(_x)){continue;} _xLen= ((localStorage[_x].length + _x.length)* 2);_lsTotal+=_xLen;};text += " (" + (_lsTotal / 1024).toFixed(2) + " KB / 5120 KB used)";
								break;
							default:
								console.error(element.textS + " is not a valid special.");
						}
				}
				
				drawButton(element, text);
			}
		}
	}
	
	// Handle block breaking
	if (breakingBlock !== null) {
		if (breakingProgress >= getBlockCustomProperties(breakingBlock.blockID).hardness) {
			noa.setBlock(0, breakingBlock.position);
			breakingProgress = 0;
		} else {
			breakingProgress += 1/dt * 10;
			
			var texture = new BABYLON.Texture("textures/break_decal_" + Math.floor(breakingProgress / (getBlockCustomProperties(breakingBlock.blockID).hardness / 7)) + ".png", 
				scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
			breakDecalMesh.material.diffuseTexture = texture;
			breakDecalMesh.material.opacityTexture = texture;
			
			renderBreakDecal(true, breakingBlock.position, breakingBlock.normal);
		}
	} else {
		renderBreakDecal(false, null, null);
	}
});



// Functions
function keydown(e) {
	if (e.key === "p") {
		togglePauseMenu();
	}
}

function setPickedBlock(block, blockName) {
	// Switch picked block
	currentBlock = block;
	
	// Switch block image
	blockImage.src = "textures/" + blockName + "_icon.png";
}

function togglePauseMenu() {
	if (guiOpen) {
		guiCanvas.style.display = "none";
		noa.container.setPointerLock(true);
		noa.entities.addComponent(playerEnt, noa.ents.names.receivesInputs);
		currentGui = null;
	} else {
		guiCanvas.style.display = "block";
		noa.container.setPointerLock(false);
		noa.entities.removeComponent(playerEnt, noa.ents.names.receivesInputs);
		currentGui = gui_pause;
	}
	guiOpen = !guiOpen;
}

function getMousePos(event) {
    var rect = guiCanvas.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x + rect.w && pos.y < rect.y  + rect.h && pos.y > rect.y;
}

function getGridPosX(arg) {
	return (arg * window.innerWidth) / 1920;
}

function getGridPosY(arg) {
	return (arg * window.innerHeight) / 1080;
}

function click(event) {
	if (guiOpen && currentGui !== null) {
		currentGui.forEach(function(element) {
			if (element.type === "button") {
				var mousePos = getMousePos(event);
				if (isInside(mousePos, element)) {
					element.func();
				}
			}
		});
	}
}

function save() {
	if (typeof(Storage) !== "undefined") {
		var saveString;
		noa.world.invalidateAllChunks();
		
		setTimeout(function() {
			saveString = JSON.stringify(saveData);
			saveString = LZString.compress(saveString);
			localStorage.setItem("world", saveString);
		}, 100);
	} else {
		alert("This browser does not support local storage!");
	}
}

function resetWorld() {
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("world", "empty");
	}
	
	location.reload();
}

function resize() {
	guiCanvas.width = window.innerWidth;
	guiCanvas.height = window.innerHeight;
}

function drawButton(element, text) {
	guiContext.beginPath();
	guiContext.fillStyle = element.color;
	guiContext.rect(getGridPosX(element.x), getGridPosY(element.y), getGridPosX(element.w), getGridPosY(element.h));
	guiContext.fill();
	
	guiContext.beginPath();
	guiContext.fillStyle = "black";
	guiContext.font = getGridPosY(36).toString() + "px Arial";
	guiContext.textAlign = "center";
	guiContext.fillText(text, getGridPosX(element.w / 2 + element.x), getGridPosY(element.h / 2 + element.y + element.h / 4));
}

function renderBreakDecal(show, positionArray, normalArray) {
	if (!breakDecalMesh) {
		breakDecalMesh = BABYLON.Mesh.CreatePlane("breakDecal", 1.0, scene);
		var material = noa.rendering.makeStandardMaterial("breakDecalMaterial");
		material.backFaceCulling = false;
		material.diffuseTexture = new BABYLON.Texture("textures/break_decal_7.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
		material.diffuseTexture.hasAlpha = true;
		material.opacityTexture = new BABYLON.Texture("textures/break_decal_7.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
		breakDecalMesh.material = material;
		noa.rendering.addMeshToScene(breakDecalMesh);
	}
	
	if (show) {
		// Borrowed from NOA rendering.js line 200
        var dist = glvec3.dist(noa.getPlayerEyePosition(), positionArray);
        var slop = 0.0005 * dist;
        var pos = glvec3.create();
        for (var i = 0; i < 3; ++i) {
            pos[i] = Math.floor(positionArray[i]) + .5 + ((0.5 + slop) * normalArray[i]);
        }
        breakDecalMesh.position.copyFromFloats(pos[0], pos[1], pos[2]);
        breakDecalMesh.rotation.x = (normalArray[1]) ? Math.PI / 2 : 0;
        breakDecalMesh.rotation.y = (normalArray[0]) ? Math.PI / 2 : 0;
	}
	
	breakDecalMesh.setEnabled(show);
}

function registerBlock(id, options_d, options) {
	blockCustomProperties[id] = options;
	return noa.registry.registerBlock(id, options_d);
}

function getBlockCustomProperties(id) {
	return blockCustomProperties[id];
}