/* globals BABYLON */
'use strict';

var opts = {
	debug: true,
	showFPS: true,
	inverseY: false,
	chunkSize: 32,
	chunkAddDistance: 3,
	chunkRemoveDistance: 3,
	blockTestDistance: 50,
	texturePath: 'textures/',
	playerStart: [0.5, 5, 0.5],
	playerHeight: 2.0,
	playerWidth: 1.0,
	playerAutoStep: false,
	useAO: true,
	AOmultipliers: [0.92, 0.8, 0.5],
	reverseAOmultiplier: 1.0
};

//create engine
var noa = noaEngine(opts);



//World generation


//register some block materials (just colors here)
var textureURL = null; // replace that to use a texture
var brownish = [0.45, 0.36, 0.22];
var greenish = [0.8, 0.0, 0.0];
noa.registry.registerMaterial('dirt', brownish, textureURL);
noa.registry.registerMaterial('grass', greenish, textureURL);


//register block types and their material name
var dirtID = noa.registry.registerBlock(0, { material: 'dirt' });
var grassID = noa.registry.registerBlock(1, { material: 'grass' });


//add a listener for when the engine requests a new world chunk
//`data` is an ndarray - see https://github.com/scijs/ndarray
noa.world.on('worldDataNeeded', function (id, data, x, y, z) {
	//populate ndarray with world data (block IDs or 0 for air)
	for (var i = 0; i < data.shape[0]; ++i) {
		for (var k = 0; k < data.shape[2]; ++k) {
			var height = getHeightMap(x + i, z + k);
			for (var j = 0; j < data.shape[1]; ++j) {
				if (y + j < height) {
					if (y + j < 0) data.set(i, j, k, dirtID)
					else data.set(i, j, k, grassID);
				}
			}
		}
	}
	//pass the finished data back to the game engine
	noa.world.setChunkData(id, data)
})

//worldgen - return a heightmap for a given [x,z]
function getHeightMap(x, z) {
	var xs = 0.8 + Math.sin(x / 10);
	var zs = 0.4 + Math.sin(z / 15 + x / 30);
	return xs + zs;
}




//add a mesh to represent the player


//get the player entity's ID and other info (aabb, size)
var eid = noa.playerEntity;
var dat = noa.entities.getPositionData(eid);
var w = dat.width;
var h = dat.height;

//make a Babylon.js mesh and scale it, etc.
var scene = noa.rendering.getScene();  // Babylon's "Scene" object
var mesh = BABYLON.Mesh.CreateBox('player', 1, scene);
mesh.scaling.x = mesh.scaling.z = w;
mesh.scaling.y = h;

//offset of mesh relative to the entity's "position" (center of its feet)
var offset = [0, h / 2, 0];

//a "mesh" component to the player entity
noa.entities.addComponent(eid, noa.entities.names.mesh, {
	mesh: mesh,
	offset: offset
});




//Interactivity:


//on left mouse, set targeted block to be air
noa.inputs.down.on('fire', function () {
	if (noa.targetedBlock) noa.setBlock(0, noa.targetedBlock.position);
})

//on right mouse, place some grass
noa.inputs.down.on('alt-fire', function () {
	if (noa.targetedBlock) noa.addBlock(grassID, noa.targetedBlock.adjacent);
})

//add a key binding for "E" to do the same as alt-fire
noa.inputs.bind('alt-fire', 'E');


//each tick, consume any scroll events and use them to zoom camera
var zoom = 0
noa.on('tick', function (dt) {
	var scroll = noa.inputs.state.scrolly
	if (scroll === 0) return
	
	//handle zoom controls
	zoom += (scroll > 0) ? 1 : -1
	if (zoom < 0) zoom = 0
	if (zoom > 10) zoom = 10
	noa.rendering.zoomDistance = zoom
})



