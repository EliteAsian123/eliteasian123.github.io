let settings = {
	textPadding: 12,
	skipErrors: false,
	enterReset: false,
	baseGenerator: "common",
	generationCount: 12,
	randomUppercase: false
};

let settingsPanel = $("#settingsContainer");
let settingsButton = $("#settingsButton"); 
let closeButton = $("#closeButton");

let textPaddingSetting = $("#textPaddingSetting");
let skipErrorsSetting = $("#skipErrorsSetting");
let enterResetSetting = $("#enterResetSetting");
let baseGeneratorSetting = $("#baseGeneratorSetting");
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
	
	updateText();
});

enterResetSetting.change(function() {
	settings.enterReset = enterResetSetting.prop("checked");
	saveSettings();
});

skipErrorsSetting.change(function() {
	settings.skipErrors = skipErrorsSetting.prop("checked");
	saveSettings();
});

baseGeneratorSetting.change(function() {
	settings.baseGenerator = baseGeneratorSetting.val();
	saveSettings();
});

generationCountSetting.bind("keyup mouseup", function() {
	if (generationCountSetting.val() > 1000)
		generationCountSetting.val(1000);
	
	if (generationCountSetting.val() < 2)
		generationCountSetting.val(2);
	
	settings.generationCount = parseInt(generationCountSetting.val());
	saveSettings();
	
	updateText();
});

randomUppercaseSetting.change(function() {
	settings.randomUppercase = randomUppercaseSetting.prop("checked");
	saveSettings();
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
}

function saveSettings() {
	localStorage.setItem("typingSettings", JSON.stringify(settings));
}