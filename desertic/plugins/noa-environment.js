/////////////////////////////////////////////////////////////
//                                                         //
// Plugin by: EliteAsian123                                //
// Code by: levlups                                        //
//                                                         //
// This plugin adds clouds and fog to your game!           //
//                                                         //
/////////////////////////////////////////////////////////////

function NoaEnvironment(nppb, cloudTexturePath) { 
	this.nppb = nppb;
	this.cloudTexturePath = cloudTexturePath;
}

NoaEnvironment.prototype.init = function() {
	this.scene = this.nppb.noa.rendering.getScene();
	this.cloudMesh = this.nppb.babylon.MeshBuilder.CreatePlane("cloudMesh", {
			height: 2e3,
			width: 2e3,
			updatable: true
	}, this.scene);
	var cloudMat = new this.nppb.babylon.StandardMaterial("cloud", this.scene);
	
	var cloudTexture = new this.nppb.babylon.Texture(this.cloudTexturePath, this.scene, true, true, this.nppb.babylon.Texture.NEAREST_SAMPLINGMODE);
	
	cloudMat.diffuseTexture = cloudTexture;
	cloudMat.diffuseTexture.hasAlpha = true;
	cloudMat.opacityTexture = cloudTexture;
	cloudMat.backFaceCulling = false;
	cloudMat.disableLighting = true;
	this.cloudMesh.rotation.x = -Math.PI / 2;
	this.cloudMesh.setPositionWithLocalVector(new this.nppb.babylon.Vector3(0, 0, 0));
	this.cloudMesh.material = cloudMat;
	this.nppb.noa.rendering.addMeshToScene(this.cloudMesh, true);
	this.cloudMesh.setEnabled(false);
	this.uOffset = 0;
	this.vOffset = 0;
}

NoaEnvironment.prototype.getName = function() {
	return "Noa Environment";
}

NoaEnvironment.prototype.setFogOptions = function(babylonFogMode, babylonColorFog, density) {
	this.scene.fogMode = babylonFogMode;
	this.scene.fogColor = babylonColorFog;
	this.scene.fogDensity = density;
}

NoaEnvironment.prototype.disableFog = function() {
	this.scene.fogMode = this.nppb.babylon.Scene.FOGMODE_NONE;
}

NoaEnvironment.prototype.setCloudOptions = function(alpha, babylonColorCloud, height) {
	this.cloudMesh.material.alpha = alpha;
	this.cloudMesh.material.emissiveColor = babylonColorCloud;
	this.cloudMesh.position.y = height;
	this.cloudMesh.setEnabled(true);
}

NoaEnvironment.prototype.disableClouds = function() {
	this.cloudMesh.setEnabled(false);
}

NoaEnvironment.prototype.moveClouds = function(uOffset, vOffset) {
	var playerPosition = this.nppb.noa.ents.getPosition(this.nppb.noa.playerEntity);
	this.cloudMesh.position.x = playerPosition[0];
	this.cloudMesh.position.z = playerPosition[2];
	this.cloudMesh.material.diffuseTexture.uOffset = playerPosition[0] / 1000 + this.uOffset;
	this.cloudMesh.material.opacityTexture.uOffset = playerPosition[0] / 1000 + this.uOffset;
	this.cloudMesh.material.diffuseTexture.vOffset = -playerPosition[2] / 1000 + this.vOffset;
	this.cloudMesh.material.opacityTexture.vOffset = -playerPosition[2] / 1000 + this.vOffset;
	this.uOffset += uOffset;
	this.vOffset += vOffset;
}