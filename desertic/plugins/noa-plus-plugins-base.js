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
	console.log("NoaPlusPlugins v1.0.0");
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

NoaPlusPlugins.prototype.getPluginNames = function() {
	return this.pluginList;
}

NoaPlusPlugins.prototype.getNoa = function() {
	return this.noa;
}

NoaPlusPlugins.prototype.getBabylon = function() {
	return this.babylon;
}