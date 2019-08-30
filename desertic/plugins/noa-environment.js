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
	var babylon = this.nppb.getBabylon();
	
	this.scene = this.nppb.getNoa().rendering.getScene();
	this.cloudMesh = this.nppb.getBabylon().MeshBuilder.CreatePlane("cloudMesh", {
			height: 2e3,
			width: 2e3
	}, this.scene);
	var cloudMat = new babylon.StandardMaterial("cloud", this.scene);
	
	var cloudTexture = new babylon.Texture(this.cloudTexturePath, this.scene, true, true, this.nppb.getBabylon().Texture.NEAREST_SAMPLINGMODE);
	
	cloudMat.diffuseTexture = cloudTexture;
	cloudMat.diffuseTexture.hasAlpha = true;
	cloudMat.opacityTexture = cloudTexture;
	cloudMat.backFaceCulling = false;
	cloudMat.disableLighting = true;
	this.cloudMesh.rotation.x = -Math.PI / 2;
	this.cloudMesh.setPositionWithLocalVector(new babylon.Vector3(0, 0, 0));
	this.cloudMesh.material = cloudMat;
	this.nppb.getNoa().rendering.addMeshToScene(this.cloudMesh, true);
	this.cloudMesh.setEnabled(false);
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
	this.scene.fogMode = this.nppb.getBabylon().Scene.FOGMODE_NONE;
}

NoaEnvironment.prototype.setCloudOptions = function(alpha, babylonColorCloud, height) {
	this.cloudMesh.material.alpha = alpha;
	this.cloudMesh.material.emissiveColor = babylonColorCloud;
	this.cloudMesh.position.y = height;
	this.cloudMesh.setEnabled(true);
}

NoaEnvironment.prototype.setProceduralOptions = function(speed) {
	this.cloudMesh.material.diffuseTexture.animationSpeedFactor = speed;
}

NoaEnvironment.prototype.disableClouds = function() {
	this.cloudMesh.setEnabled(false);
}