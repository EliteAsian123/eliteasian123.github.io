let settings = {
	textPadding: 12,
	skipErrors: true,
	enterReset: false,
	baseGenerator: "common",
	generationCount: 12,
	randomUppercase: false,
	customText: "Type the text you want to type here! The text CANNOT be less than 2 characters."
};

let settingsPanel = $("#settingsContainer");
let settingsButton = $("#settingsButton"); 
let closeButton = $("#closeButton");

let textPaddingSetting = $("#textPaddingSetting");
let skipErrorsSetting = $("#skipErrorsSetting");
let enterResetSetting = $("#enterResetSetting");
let baseGeneratorSetting = $("#baseGeneratorSetting");
let customTextSetting = $("#customTextSetting");
let generationCountSetting = $("#generationCountSetting");
let randomUppercaseSetting = $("#randomUppercaseSetting");

settingsPanel.hide();

function isSettingsShowing() {
	return settingsPanel.is(":visible");
}

settingsButton.click(function() {
	if (!isSettingsShowing()) {
		settingsPanel.show();
		
		textPaddingSetting.val(settings.textPadding);
		skipErrorsSetting.prop("checked", settings.skipErrors);
		enterResetSetting.prop("checked", settings.enterReset);
		baseGeneratorSetting.val(settings.baseGenerator);
		customTextSetting.val(settings.customText);
		generationCountSetting.val(settings.generationCount);
		randomUppercaseSetting.prop("checked", settings.randomUppercase);
	}
});

closeButton.click(function() {
	if (isSettingsShowing()) {
		settingsPanel.hide();
		start();
	}
});



textPaddingSetting.bind("keyup mouseup", function() {
	if (textPaddingSetting.val() > 18)
		textPaddingSetting.val(18);
	
	if (textPaddingSetting.val() < 6)
		textPaddingSetting.val(6);
	
	settings.textPadding = parseInt(textPaddingSetting.val());
	saveSettings();
	
	onSettingUpdate();
});

enterResetSetting.change(function() {
	settings.enterReset = enterResetSetting.prop("checked");
	saveSettings();
	
	onSettingUpdate();
});

skipErrorsSetting.change(function() {
	settings.skipErrors = skipErrorsSetting.prop("checked");
	saveSettings();
	
	onSettingUpdate();
});

baseGeneratorSetting.change(function() {
	settings.baseGenerator = baseGeneratorSetting.val();
	saveSettings();
	
	onSettingUpdate();
});

customTextSetting.bind("keyup", function() {
	if (customTextSetting.val().length >= 2) {
		settings.customText = customTextSetting.val();
		saveSettings();
	}
	
	onSettingUpdate();
});

generationCountSetting.bind("keyup mouseup", function() {
	if (generationCountSetting.val() > 500)
		generationCountSetting.val(500);
	
	if (generationCountSetting.val() < 2)
		generationCountSetting.val(2);
	
	settings.generationCount = parseInt(generationCountSetting.val());
	saveSettings();
	
	onSettingUpdate();
});

randomUppercaseSetting.change(function() {
	settings.randomUppercase = randomUppercaseSetting.prop("checked");
	saveSettings();
	
	onSettingUpdate();
});

function loadSettings() {
	let settingsString = localStorage.getItem("typingSettings");
	
	if (settingsString !== null) {
		newSettings = JSON.parse(settingsString)
		
		for (let i in settings) {
			if (!newSettings[i]) {
				newSettings[i] = settings[i];
			}
		}
		
		settings = newSettings;
	} else {
		// Legacy
		let textPaddingLocal = localStorage.getItem("textPadding");
		let skipErrorsLocal = localStorage.getItem("skipErrors");
		let enterResetLocal = localStorage.getItem("enterReset");
		let baseGeneratorLocal = localStorage.getItem("baseGenerator");
		let generationCountLocal = localStorage.getItem("generationCount");
		
		if (textPaddingLocal !== null)
			settings.textPadding = parseInt(textPaddingLocal);
		
		if (skipErrorsLocal !== null)
			settings.skipErrors = (skipErrorsLocal == "true");
		
		if (enterResetLocal !== null)
			settings.enterReset = (enterResetLocal == "true")
		
		if (baseGeneratorLocal !== null)
			settings.baseGenerator = baseGeneratorLocal;
		
		if (generationCountLocal !== null)
			settings.generationCount = parseInt(generationCountLocal);
		
		localStorage.removeItem("textPadding");
		localStorage.removeItem("skipErrors");
		localStorage.removeItem("enterReset");
		localStorage.removeItem("baseGenerator");
		localStorage.removeItem("generationCount");
		
		saveSettings();
	}
	
	onSettingUpdate();
}

function saveSettings() {
	localStorage.setItem("typingSettings", JSON.stringify(settings));
}

function onSettingUpdate() {
	if (settings.baseGenerator !== "pi" && settings.baseGenerator !== "custom") {
		randomUppercaseSetting.parent().show();
	} else {
		randomUppercaseSetting.parent().hide();
	}
	
	if (settings.baseGenerator === "common") {
		generationCountSetting.parent().find("._word").show();
		generationCountSetting.parent().find("._character").hide();
	} else {
		generationCountSetting.parent().find("._word").hide();
		generationCountSetting.parent().find("._character").show();
	}
	
	if (settings.baseGenerator === "custom") {
		customTextSetting.parent().show();
		generationCountSetting.parent().hide();
	} else {
		customTextSetting.parent().hide();
		generationCountSetting.parent().show();
	}
}