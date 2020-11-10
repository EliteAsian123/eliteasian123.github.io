let textPadding = 12;
let skipErrors = false;
let enterReset = false;
let baseGenerator = "common";
let generationCount = 12;

let settingsPanel = $("#settingsContainer");
let settingsButton = $("#settingsButton"); 
let closeButton = $("#closeButton");

let textPaddingSetting = $("#textPaddingSetting");
let skipErrorsSetting = $("#skipErrorsSetting");
let enterResetSetting = $("#enterResetSetting");
let baseGeneratorSetting = $("#baseGeneratorSetting");
let generationCountSetting = $("#generationCountSetting");

settingsPanel.hide();

function isSettingsShowing() {
	return settingsPanel.is(":visible");
}

settingsButton.click(function() {
	if (!isSettingsShowing()) {
		settingsPanel.show();
		
		textPaddingSetting.val(textPadding);
		skipErrorsSetting.prop("checked", skipErrors);
		enterResetSetting.prop("checked", enterReset);
		baseGeneratorSetting.val(baseGenerator);
		generationCountSetting.val(generationCount);
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
	
	textPadding = textPaddingSetting.val();
	saveSettings();
	
	updateText();
});

enterResetSetting.change(function() {
	enterReset = enterResetSetting.prop("checked");
	saveSettings();
});

skipErrorsSetting.change(function() {
	skipErrors = skipErrorsSetting.prop("checked");
	saveSettings();
});

baseGeneratorSetting.change(function() {
	baseGenerator = baseGeneratorSetting.val();
	saveSettings();
});

generationCountSetting.bind("keyup mouseup", function() {
	if (generationCountSetting.val() > 1000)
		generationCountSetting.val(1000);
	
	if (generationCountSetting.val() < 2)
		generationCountSetting.val(2);
	
	generationCount = generationCountSetting.val();
	saveSettings();
	
	updateText();
});


function loadSettings() {
	let textPaddingLocal = localStorage.getItem("textPadding");
	let skipErrorsLocal = localStorage.getItem("skipErrors");
	let enterResetLocal = localStorage.getItem("enterReset");
	let baseGeneratorLocal = localStorage.getItem("baseGenerator");
	let generationCountLocal = localStorage.getItem("generationCount");
	
	if (textPaddingLocal !== null)
		textPadding = parseInt(textPaddingLocal);
	
	if (skipErrorsLocal !== null)
		skipErrors = (skipErrorsLocal == "true");
	
	if (enterResetLocal !== null)
		enterReset = (enterResetLocal == "true")
	
	if (baseGeneratorLocal !== null)
		baseGenerator = baseGeneratorLocal;
	
	if (generationCountLocal !== null)
		generationCount = parseInt(generationCountLocal);
}

function saveSettings() {
	localStorage.setItem("textPadding", textPadding);
	localStorage.setItem("skipErrors", skipErrors);
	localStorage.setItem("enterReset", enterReset);
	localStorage.setItem("baseGenerator", baseGenerator);
	localStorage.setItem("generationCount", generationCount);
}