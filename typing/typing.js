let textPanel = $("#textPanel");
let wholeTextPanel = $("#wholeTextPanel");
let loadingPanel = $("#loading");
let container = $("#container");
let statsPanel = $("#stats");
let pressEnterPanel = $("#pressEnter");

let text = "";

let textIndex = 0;
let typingStatus = [];
let characterTimes = [];
let finished = false;

loadingPanel.show();
container.hide();
pressEnterPanel.css({ opacity: 0 });

function start() {
	finished = false;
	
	characterTimes = [];
	textIndex = 0;
	typingStatus = [];	
	
	text = generateText();
	for (let i = 0; i < text.length; i++) {
		typingStatus.push("none");
	}
	
	container.show();
	loadingPanel.hide();
	pressEnterPanel.fadeTo(150, 0);
	
	updateText();
}

function finish() {
	finished = true;
	
	updateStats();
	
	pressEnterPanel.fadeTo(150, 1);
}

function updateText() {
	let output = "";
	
	if (textIndex < text.length) {
		for (let i = 0; i < settings.textPadding * 2 + 1; i++) {
			let index = i - settings.textPadding + textIndex;
			
			let character = text.charAt(index);
			if (character == "") {
				output += inSpan("notPartOfText", " ");
			} else {
				let classes = [];
				
				let status = typingStatus[index];
				if (status != "none") {
					classes.push(status);
				}
				
				if (i == settings.textPadding) {
					classes.push("currentChar");
				}
				
				output += inSpan(classes.join(" "), character);
			}
		}
	} else {
		output = "Time: " + getTime() + " sec.";
		
		let addedSpaces = settings.textPadding * 2 + 1 - output.length;
		
		for (let i = 0; i < addedSpaces; i++) {
			output += " ";
		}
	}
	
	let wholeTextOutput = "";
	
	for (let i = 0; i < text.length; i++) {
		let character = text.charAt(i);
		
		let classes = [];
			
		let status = typingStatus[i];
		if (status != "none") {
			classes.push(status);
		}
		
		if (i == textIndex) {
			classes.push("currentChar");
		}
		
		wholeTextOutput += inSpan(classes.join(" "), character);
	}
	
	wholeTextPanel.html(wholeTextOutput);
	textPanel.html(output);
}

function inSpan(c, t) {
	return "<span class=\"" + c + "\">" + t + "</span>";
}

function getCpm() {
	let total = 0;
	for (let i = 0; i < characterTimes.length - 1; i++)
		total += characterTimes[i + 1] - characterTimes[i]; 
	
	return (1 / ((total / (characterTimes.length - 1)) / 1000) * 60).toFixed(2);
}

function getWpm() {
	return (getCpm() / 5).toFixed(2);
}

function getTime() {
	return ((characterTimes[characterTimes.length - 1] - characterTimes[0]) / 1000).toFixed(2);
}

function getError() {
	let error = 0;
	for (let i of typingStatus) {
		if (i == "mistake") {
			error++;
		}
	}
	
	return (error / (typingStatus.length) * 100).toFixed(2);
}

function getScore() {
	return (getWpm() * (1 - getError() / 100)).toFixed(2);
}

function updateStats() {
	if (!settings.showCpm) {
		if (characterTimes.length <= 0) {
			statsPanel.html("<b>WPM:</b> --.--, <b>Error: </b> --.--%, <b>Score:</b> --.--");
		} else {
			statsPanel.html("<b>WPM:</b> " + getWpm() + ", <b>Error:</b> " + getError() + "%, <b>Score:</b> " + getScore());
		}
	} else {
		if (characterTimes.length <= 0) {
			statsPanel.html("<b>CPM:</b> --.--, <b>Error: </b> --.--%, <b>Score:</b> --.--");
		} else {
			statsPanel.html("<b>CPM:</b> " + getCpm() + ", <b>Error:</b> " + getError() + "%, <b>Score:</b> " + getScore());
		}
	}
}

$(window).keypress(function(event) {
	if (!isSettingsShowing()) {
		if (textIndex < text.length) {
			if (event.key == text.charAt(textIndex)) {
				if (typingStatus[textIndex] == "none") {
					typingStatus[textIndex] = "perfect";
				} else if (typingStatus[textIndex] == "wasMistake") {
					typingStatus[textIndex] = "corrected";
				}
				
				textIndex++;
				
				characterTimes.push(event.timeStamp);
			} else {
				typingStatus[textIndex] = "mistake";
				
				if (settings.skipErrors) {
					textIndex++;
					
					characterTimes.push(event.timeStamp);
				}
			}
		}

		if (textIndex >= text.length) {
			if (!finished)
				finish();
			
			if (event.keyCode == 13) {
				start();
				return;
			}
		}

		if (settings.enterReset && event.keyCode == 13) {
			start();
			return;
		}

		updateText();
	}
}).keydown(function(event) {
	if (textIndex > 0 && !finished) {
		if (event.keyCode == 8 && settings.skipErrors) {
			textIndex--;
			
			if (typingStatus[textIndex] == "mistake" || typingStatus[textIndex] == "corrected") {
				typingStatus[textIndex] = "wasMistake";
			} else {
				typingStatus[textIndex] = "none";
			}
				
			
			updateText();
		} 
	}
});

$(function() {
	loadSettings();
	
	start();
	updateStats();
});