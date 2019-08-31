/////////////////////////////////////////////////////////////
//                                                         //
// Plugin by: EliteAsian123                                //
// Code by: EliteAsian123                                  //
//                                                         //
// This plugin adds saves chunks to RAM.                   //
//                                                         //
/////////////////////////////////////////////////////////////

function NoaChunkSave(nppb, voxelCrunch) {
	this.nppb = nppb;
	this.voxelCrunch = voxelCrunch;
	this.saveData = {};
}

NoaChunkSave.prototype.init = function() {}

NoaChunkSave.prototype.getName = function() {
	return "Noa Chunk Save";
}

NoaChunkSave.prototype.chunkSave = function(id, array) {
	var encodedData = this.voxelCrunch.encode(array.data);
	this.saveData[id.toString()] = encodedData;
}

NoaChunkSave.prototype.chunkLoad = function(id, data) {
	var decodedData = this.voxelCrunch.decode(this.saveData[id.toString()], new Uint32Array(data.data.length));
	data.data = decodedData;
	return data;
}

NoaChunkSave.prototype.isChunkSaved = function(id) {
	return (id.toString() in this.saveData);
}

NoaChunkSave.prototype.getSaveData = function() {
	this.nppb.noa.world.invalidateAllChunks();
	return this.saveData;
}

NoaChunkSave.prototype.getSaveDataJSON = function() {
	this.nppb.noa.world.invalidateAllChunks();
	return JSON.stringify(this.saveData);
}

NoaChunkSave.prototype.setSaveData = function(saveData) {
	this.saveData = saveData;
}

NoaChunkSave.prototype.setSaveDataJSON = function(saveDataJSON) {
	var e = JSON.stringify(this.saveData);
	var saveString = saveDataJSON;
	saveString = JSON.parse(saveString);
	var saveStringKeys = Object.keys(saveString);
	for (var element of saveStringKeys) {
		if (typeof saveString[element] !== Uint8Array) {
			saveString[element] = Object.keys(saveString[element]).map(function(key) {
				return saveString[element][key];
			});
		}
	}
	this.saveData = saveString;
}