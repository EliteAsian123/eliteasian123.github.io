/////////////////////////////////////////////////////////////
//                                                         //
// Plugin by: EliteAsian123                                //
// Code by: EliteAsian123                                  //
//                                                         //
// This is the base for noa-plus-plugins.                  //
//                                                         //
/////////////////////////////////////////////////////////////

function NoaPlusPlugins(noa, babylon) {
	this.noa = noa;
	this.babylon = babylon;
	this.pluginList = [];
	this.blockCustomOptions = [];
	console.log("NoaPlusPlugins v1.0.5");
}

NoaPlusPlugins.prototype.addPlugin = function(plugin) {
	plugin.init();
	this.pluginList.push(plugin.getName());	
}

NoaPlusPlugins.prototype.registerBlock = function(id, optionsDefault, optionsCustom) {
	this.blockCustomOptions[id] = optionsCustom;
	return this.noa.registry.registerBlock(id, optionsDefault);
}

NoaPlusPlugins.prototype.getBlockCustomOptions = function(id, optionName) {
	if (optionName in this.blockCustomOptions[id]) {
		return this.blockCustomOptions[id][optionName];
	} else {
		return null;
	}
}

function Decal(nppb, glvec3, name, texturePath) {
	this.nppb = nppb;
	this.glvec3 = glvec3;
	this.dpos = [];
	var decalMesh = this.nppb.babylon.Mesh.CreatePlane(name, 1.0, scene);
	var material = this.nppb.noa.rendering.makeStandardMaterial(name + "Material");
	material.backFaceCulling = false;
	decalMesh.material = material;
	this.nppb.noa.rendering.addMeshToScene(decalMesh);
	decalMesh.setEnabled(false);
	
	this.mesh = decalMesh;
	
	this.changeTexture(decalMesh, texturePath);
	
	this.showing = false;
}

Decal.prototype.changeTexture = function(texturePath) {
	this.mesh.material.diffuseTexture = new this.nppb.babylon.Texture(texturePath, scene, false, true, this.nppb.babylon.Texture.NEAREST_SAMPLINGMODE);
	this.mesh.material.diffuseTexture.hasAlpha = true;
	this.mesh.material.opacityTexture = new this.nppb.babylon.Texture(texturePath, scene, false, true, this.nppb.babylon.Texture.NEAREST_SAMPLINGMODE);
}

Decal.prototype.showOnFace = function(positionArray, normalArray) {
	// Borrowed from NOA rendering.js line 193

	this.nppb.noa.globalToLocal(positionArray, null, this.dpos);
	var dist = this.glvec3.dist(this.nppb.noa.camera._localGetPosition(), this.dpos);
	var slop = 0.001 + 0.002 * dist;
	for (var i = 0; i < 3; i++) {
		if (normalArray[i] === 0) {
			this.dpos[i] += 0.5;
        } else {
			this.dpos[i] += (normalArray[i] > 0) ? 1 + slop : -slop;
        }
	}
	this.mesh.position.copyFromFloats(this.dpos[0], this.dpos[1], this.dpos[2]);
	this.mesh.rotation.x = (normalArray[1]) ? Math.PI / 2 : 0;
	this.mesh.rotation.y = (normalArray[0]) ? Math.PI / 2 : 0;
	
	this.mesh.setEnabled(true);
	this.showing = true;
}

Decal.prototype.hide = function() {
	this.mesh.setEnabled(false);
	this.showing = false;
}