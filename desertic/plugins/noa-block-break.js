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
	this.down = false;
}

NoaBlockBreak.prototype.init = function() {
	this.breakDecal = new Decal(this.nppb, this.glvec3, "breakDecal", this.textures[0]);
}

NoaBlockBreak.prototype.getName = function() {
	return "Noa Block Break";
}

NoaBlockBreak.prototype.fireDown = function() {
	this.down = true;
}

NoaBlockBreak.prototype.fireUp = function() {
	this.down = false;
}

NoaBlockBreak.prototype.render = function(dt, modifier) {
	if (this.block !== null && this.nppb.noa.targetedBlock !== null) {
		if (this.timer >= this.nppb.getBlockCustomOptions(this.block.blockID, "hardness")) {
			this.nppb.noa.setBlock(0, this.block.position);
			this.timer = -1;
			this.block = null;
		} else {
			this.timer += dt / 150 * modifier;
			this.breakDecal.changeTexture(this.textures[Math.floor(this.timer / (this.nppb.getBlockCustomOptions(this.block.blockID, "hardness") / 7))]);
			
			this.breakDecal.showOnFace(this.block.position, this.block.normal);
		}
	} else {
		this.breakDecal.hide();
	}
	
	if (this.nppb.noa.targetedBlock === null || this.block === null) {
		this.breakDecal.hide();
	}
	
	if (this.nppb.noa.targetedBlock && this.down) {
		if (this.block === null) {
			this.block = this.nppb.noa.targetedBlock;
		}
	}
	
	if (!this.down) {
		this.block = null;
		this.timer = 0;
	}
}