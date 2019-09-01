/////////////////////////////////////////////////////////////
//                                                         //
// Plugin by: EliteAsian123                                //
// Code by: EliteAsian123                                  //
//                                                         //
// This plugin adds block breaking into the game.          //
//                                                         //
/////////////////////////////////////////////////////////////

function NoaBlockBreak(nppb, glvec3, textures) {
	this.nppb = nppb;
	this.glvec3 = glvec3;
	this.textures = textures;
	
	this.block = null;
	this.timer = 0;
}

NoaBlockBreak.prototype.init = function() {
	this.breakDecal = new Decal(this.nppb, this.glvec3, "breakDecal", this.textures[0]);
	console.log(this.breakDecal);
}

NoaBlockBreak.prototype.getName = function() {
	return "Noa Block Break";
}

NoaBlockBreak.prototype.fireDown = function() {
	if (this.nppb.noa.targetedBlock) {
		if (this.block === null) {
			this.block = this.nppb.noa.targetedBlock;
		}
	}
}

NoaBlockBreak.prototype.fireUp = function() {
	this.block = null;
	this.timer = 0;
}

NoaBlockBreak.prototype.render = function(dt, modifier) {
	if (this.block !== null && this.nppb.noa.targetedBlock !== null) {
		if (this.timer >= this.nppb.getBlockCustomOptions(this.block.blockID, "hardness")) {
			this.nppb.noa.setBlock(0, this.block.position);
			this.timer = -1;
		} else {
			this.timer += dt / 150 * modifier;
			this.breakDecal.changeTexture(this.textures[Math.floor(this.timer / (this.nppb.getBlockCustomOptions(this.block.blockID, "hardness") / 7))]);
			
			this.breakDecal.showOnFace(this.block.position, this.block.normal);
		}
	} else {
		this.breakDecal.hide();
	}
	
	if (this.nppb.noa.targetedBlock === null) {
		this.breakDecal.hide();
	}
}