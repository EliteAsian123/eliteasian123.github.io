let textPadding = 12;
let skipErrors = false;

let settingsPanel = $("#settingsContainer");
let settingsButton = $("#settingsButton"); 
let closeButton = $("#closeButton");

let textPaddingSetting = $("#textPaddingSetting");
let skipErrorsSetting = $("#skipErrorsSetting");

settingsPanel.hide();

function isSettingsShowing() {
	return settingsPanel.is(":visible");
}

settingsButton.click(function() {
	if (!isSettingsShowing()) {
		settingsPanel.show();
		
		textPaddingSetting.val(textPadding);
		skipErrorsSetting.prop("checked", skipErrors);
	}
});

closeButton.click(function() {
	if (isSettingsShowing()) {
		settingsPanel.hide();
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

skipErrorsSetting.change(function() {
	skipErrors = skipErrorsSetting.prop("checked");
	saveSettings();
});

function loadSettings() {
	let textPaddingLocal = localStorage.getItem("textPadding");
	let skipErrorsLocal = localStorage.getItem("skipErrors");
	
	if (textPaddingLocal !== null)
		textPadding = parseInt(textPaddingLocal);
	
	if (skipErrorsLocal !== null)
		skipErrors = (skipErrorsLocal == "true");
}

function saveSettings() {
	localStorage.setItem("textPadding", textPadding);
	localStorage.setItem("skipErrors", skipErrors);
}