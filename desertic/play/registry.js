var tools = {
	hands: {name: "hands", incorrectToolEfficiency: 0.15, correctToolEfficiency: 0.5},
	rocks: {name: "rocks", incorrectToolEfficiency: 0.25, correctToolEfficiency: 0.65},
	pickaxe: {name: "pickaxe", incorrectToolEfficiency: 0.45, correctToolEfficiency: 1.5},
	shovel: {name: "shovel", incorrectToolEfficiency: 0.2, correctToolEfficiency: 0.95},
	cactus_saw: {name: "cactus_saw", incorrectToolEfficiency: 0.35, correctToolEfficiency: 2.4}
};

var items = {
	item_crude_pickaxe: {name: "Pickaxe", tool: "pickaxe", texture: "textures/crude_pickaxe.png"},
	item_crude_shovel: {name: "Shovel", tool: "shovel", texture: "textures/crude_shovel.png"},
	item_crude_cactus_saw: {name: "Cactus Saw", tool: "cactus_saw", texture: "textures/crude_cactus_saw.png"},
	item_twine: {name: "Twine", tool: "hands", texture: "textures/twine.png"},
	item_rocks: {name: "Rocks", tool: "rocks", texture: "textures/rocks.png"},
	item_stick: {name: "Stick", tool: "hands", texture: "textures/stick.png"}
};

var materials = [
	{name: "dry_dirt", color: null, texture: "textures/dry_dirt.png"},
	{name: "sand", color: null, texture: "textures/sand.png"},
	{name: "stone", color: null, texture: "textures/stone.png"},
	{name: "cactus_side", color: null, texture: "textures/cactus_side.png"},
	{name: "cactus_top", color: null, texture: "textures/cactus_top.png"},
	{name: "cactus_bottom", color: null, texture: "textures/cactus_bottom.png"}
];

var blocks = {
	dry_dirt: {name: "dry_dirt", material: "dry_dirt", hardness: 3, tool: ["hands", "shovel", "rocks"]},
	sand: {name: "sand", material: "sand", hardness: 2.8, tool: ["hands", "shovel", "rocks"]},
	stone: {name: "stone", material: "stone", hardness: 10, tool: ["pickaxe"]},
	cactus_top: {name: "cactus_top", material: ["cactus_top", "cactus_bottom", "cactus_side"], hardness: 10, tool: ["cactus_saw"], updatingBlock: true},
	cactus_bottom: {name: "cactus_bottom", material: ["cactus_bottom", "cactus_bottom", "cactus_side"], hardness: 10, tool: ["cactus_saw"], updatingBlock: true, drop: "blocks_cactus_top"}
};

var uis = {
	inventory: [
		{type: "image", path: "textures/item_inventory.png", x: 0, y: 0, width: 130, height: 78},
		{type: "slot", x: -54 + (18 * 1), y: -8 + (18 * 2), width: 16, height: 16, slotLoc: "itemBar", slotNum: 0},
		{type: "slot", x: -54 + (18 * 2), y: -8 + (18 * 2), width: 16, height: 16, slotLoc: "itemBar", slotNum: 1},
		{type: "slot", x: -54 + (18 * 3), y: -8 + (18 * 2), width: 16, height: 16, slotLoc: "itemBar", slotNum: 2},
		{type: "slot", x: -54 + (18 * 4), y: -8 + (18 * 2), width: 16, height: 16, slotLoc: "itemBar", slotNum: 3},
		{type: "slot", x: -54 + (18 * 5), y: -8 + (18 * 2), width: 16, height: 16, slotLoc: "itemBar", slotNum: 4},

		{type: "slot", x: -54 + (18 * 0), y: -8 + (18 * 0), width: 16, height: 16, slotLoc: "inventory", slotNum: 0},
		{type: "slot", x: -54 + (18 * 1), y: -8 + (18 * 0), width: 16, height: 16, slotLoc: "inventory", slotNum: 1},
		{type: "slot", x: -54 + (18 * 2), y: -8 + (18 * 0), width: 16, height: 16, slotLoc: "inventory", slotNum: 2},
		{type: "slot", x: -54 + (18 * 3), y: -8 + (18 * 0), width: 16, height: 16, slotLoc: "inventory", slotNum: 3},
		{type: "slot", x: -54 + (18 * 4), y: -8 + (18 * 0), width: 16, height: 16, slotLoc: "inventory", slotNum: 4},
		{type: "slot", x: -54 + (18 * 5), y: -8 + (18 * 0), width: 16, height: 16, slotLoc: "inventory", slotNum: 5},
		{type: "slot", x: -54 + (18 * 6), y: -8 + (18 * 0), width: 16, height: 16, slotLoc: "inventory", slotNum: 6},

		{type: "slot", x: -54 + (18 * 0), y: -8 + (18 * 1), width: 16, height: 16, slotLoc: "inventory", slotNum: 7},
		{type: "slot", x: -54 + (18 * 1), y: -8 + (18 * 1), width: 16, height: 16, slotLoc: "inventory", slotNum: 8},
		{type: "slot", x: -54 + (18 * 2), y: -8 + (18 * 1), width: 16, height: 16, slotLoc: "inventory", slotNum: 9},
		{type: "slot", x: -54 + (18 * 3), y: -8 + (18 * 1), width: 16, height: 16, slotLoc: "inventory", slotNum: 10},
		{type: "slot", x: -54 + (18 * 4), y: -8 + (18 * 1), width: 16, height: 16, slotLoc: "inventory", slotNum: 11},
		{type: "slot", x: -54 + (18 * 5), y: -8 + (18 * 1), width: 16, height: 16, slotLoc: "inventory", slotNum: 12},
		{type: "slot", x: -54 + (18 * 6), y: -8 + (18 * 1), width: 16, height: 16, slotLoc: "inventory", slotNum: 13},

		{type: "trash", x: 54, y: -30, width: 16, height: 16}
	]
};