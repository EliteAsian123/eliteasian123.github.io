// Important Variables //
var itemBarItems;
var itemBarItemsCount;
var inventoryItems;
var inventoryItemsCount;

var heldItem;
var heldItemCount;

var numbersImage = new Image();
numbersImage.src = "textures/numbers.png";

// Registery //
var tools = {
	hands: {name: "hands", incorrectToolEfficiency: 0.15, correctToolEfficiency: 0.5},
	rocks: {name: "rocks", incorrectToolEfficiency: 0.25, correctToolEfficiency: 0.65},
	pickaxe: {name: "pickaxe", incorrectToolEfficiency: 0.45, correctToolEfficiency: 1.5},
	shovel: {name: "shovel", incorrectToolEfficiency: 0.2, correctToolEfficiency: 0.95},
	cactus_saw: {name: "cactus_saw", incorrectToolEfficiency: 0.35, correctToolEfficiency: 2.4},
	admin_tool: {name: "admin_tool", incorrectToolEfficiency: 10, correctToolEfficiency: 10}
};

var items = {
	item_crude_pickaxe: {name: "Pickaxe", tool: "pickaxe", texture: "textures/crude_pickaxe.png"},
	item_crude_shovel: {name: "Shovel", tool: "shovel", texture: "textures/crude_shovel.png"},
	item_crude_cactus_saw: {name: "Cactus Saw", tool: "cactus_saw", texture: "textures/crude_cactus_saw.png"},
	item_twine: {name: "Twine", tool: "hands", texture: "textures/twine.png"},
	item_rocks: {name: "Rocks", tool: "rocks", texture: "textures/rocks.png"},
	item_stick: {name: "Stick", tool: "hands", texture: "textures/stick.png"},
	item_admin_tool: {name: "Admin Tool", tool: "admin_tool", texture: "textures/admin_tool.png"}
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
	cactus_bottom: {name: "cactus_bottom", material: ["cactus_bottom", "cactus_bottom", "cactus_side"], hardness: 10, tool: ["cactus_saw"], updatingBlock: true, drop: "block_cactus_top"}
};

var uis = {
	inventory: function(ui) {
		// UI Image
		ui.add(new UIImage(0, 0, 130, 78, new AnchorCenter(ui), "textures/item_inventory.png"));

		// Itembar Slots
		for (var i = 0; i < 5; i++) {
			/* TODO: Better way to do this. */
			eval(`
				ui.add(new UIItemSlot(-54 + (18 * (` + i + ` + 1)), -8 + (18 * 2), 16, 16, new AnchorCenter(ui), function() {
					return itemBarItems[` + i + `];
				}, function() {
					return itemBarItemsCount[` + i + `];
				}, function(x) {
					itemBarItems[` + i + `] = x;
				}, function(x) {
					itemBarItemsCount[` + i + `] = x;
				}));
			`);
		}

		// Inventory Slots
		for (var i = 0; i < 14; i++) {
			var x;
			var y;
			if (i >= 7) {
				x = -54 + (18 * (i - 7));
				y = -8 + (18 * 1);
			} else {
				x = -54 + (18 * i);
				y = -8 + (18 * 0);
			}
			/* TODO: Better way to do this. */
			eval(`
				ui.add(new UIItemSlot(` + x + `, ` + y + `, 16, 16, new AnchorCenter(ui), function() {
					return inventoryItems[` + i + `];
				}, function() {
					return inventoryItemsCount[` + i + `];
				}, function(x) {
					inventoryItems[` + i + `] = x;
				}, function(x) {
					inventoryItemsCount[` + i + `] = x;
				}));
			`);
		}
		
		// Trash Slot
		ui.add(new UIItemTrash(54, -30, 16, 16, new AnchorCenter(ui)));
	}
};