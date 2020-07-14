// PRE-INIT
const colorData = {
	"yellow": "var(--color-yellow)",
	"blue": "var(--color-blue)",
	"red": "var(--color-red)"
}

const zoomLevels = [
	10,
	20,
	40,
	80,
	160,
	320,
	640
]

let loadingElement = $("#loading");
let coverElement = $("#cover");

let timelineContainer = $("#timeline-container"); 

let leftArrow = $("#left-arrow");
let rightArrow = $("#right-arrow");

let zoomIn = $("#zoom-in");
let zoomOut = $("#zoom-out");

let save = {};
let timelineElements = [];

let scrollOffset = 0;
let zoom = 3;

loadingElement.fadeIn(250);

// INIT
save = {
	"name": "Test",
	
	"timeline": [
		{
			"year": 2000,
			"eventName": "2000!",
			"category": "yellow"
		},
		{
			"year": 2001,
			"eventName": "2001!",
			"category": "blue"
		},
		{
			"year": 2002,
			"eventName": "2002!",
			"category": "red"
		},
		{
			"year": 2003,
			"eventName": "2003!",
			"category": "yellow"
		},
		{
			"year": 2004,
			"eventName": "2004!",
			"category": "blue"
		},
		{
			"year": 2005,
			"eventName": "2005!",
			"category": "red"
		},
		{
			"year": 2006,
			"eventName": "2006!",
			"category": "yellow"
		},
		{
			"year": 2007,
			"eventName": "2007!",
			"category": "blue"
		},
		{
			"year": 2008,
			"eventName": "2008!",
			"category": "red"
		},
		{
			"year": 2009,
			"eventName": "2009!",
			"category": "yellow"
		},
		{
			"year": 2010,
			"eventName": "2010!",
			"category": "blue"
		}
	]
};

updateElements();

$(window).bind("mousewheel", function(event) {
	if(event.originalEvent.wheelDelta < 0) {
		changeScrollOffset(10);
	} else {
		changeScrollOffset(-10);
	}
});

zoomIn.click(function() {
	if (zoom < zoomLevels.length - 1) {
		zoom++
		updateElements();
		updateZoom(zoom - 1);
	}
});

zoomOut.click(function() {
	if (zoom > 0) {
		zoom--;
		updateElements();
		updateZoom(zoom	+ 1);
	}
});

scrollOffset = getMinYear() * zoomLevels[zoom];
updateScrollOffset();

// POST-INIT
loadingElement.fadeOut(250);
coverElement.fadeOut(1000);

// FUNCTIONS
function updateElements() {
	timelineContainer.children().remove();
	
	for (let i of save.timeline) {
		let j = $("<div class=\"timeline-element-container\" style=\"left: " + (i.year * zoomLevels[zoom]) + "px;\"></div>");

		j.mouseenter(function() {
			$(this).append("<div class=\"timeline-element\" style=\"background-color: " + colorData[i.category] + ";\">" + i.eventName + "</div>");
		});
		
		j.mouseleave(function() {
			$(this).children(".timeline-element").remove();
		});
		
		timelineContainer.append(j);
		
		timelineElements.push(j);
		
		let l = $("<div class=\"timeline-major-label\" style=\"left: " + (i.year * zoomLevels[zoom]) + "px; background-color: " + colorData[i.category] + ";\">" + i.year + "</div>");
		
		timelineContainer.append(l);
	}
	
	let minYear = getMinYear();
	let maxYear = getMaxYear();
	
	for (let label = Math.ceil((minYear) / 10) * 10; label <= maxYear; label += 10) {
		let j = $("<div class=\"timeline-minor-label\" style=\"left: " + (label * zoomLevels[zoom]) + "px;\">" + label + "</div>");
		
		timelineContainer.append(j);
	}
	
	$("#title").text(save.name);
}

function changeScrollOffset(amount) {
	if (amount < 0) {
		let min = getMinYear();
		if (scrollOffset + amount >= min * zoomLevels[zoom]) {
			scrollOffset += amount;
		} else {
			scrollOffset = min * zoomLevels[zoom];
		}
	} else {
		let max = getMaxYear()
		if (scrollOffset + amount <= max * zoomLevels[zoom]) {
			scrollOffset += amount;
		} else {
			scrollOffset = max * zoomLevels[zoom];
		}
	}
	
	updateScrollOffset();
}

function getMaxYear() {
	let max = -1;
	for (let i of save.timeline) {
		if (max == -1) {
			max = i.year;
			continue;
		}
		
		if (i.year > max)
			max = i.year;
	}
	
	return max;
}

function getMinYear() {
	let min = -1;
	for (let i of save.timeline) {
		if (min == -1) {
			min = i.year;
			continue;
		}
		
		if (i.year < min)
			min = i.year;
	}	
	
	return min;
}

function updateScrollOffset() {
	timelineContainer.css("right", scrollOffset);	
}

function updateZoom(oldZoom) {
	$("#zoom").text(zoomLevels[zoom] / 10 / 8 + "x");
	
	scrollOffset = scrollOffset / zoomLevels[oldZoom] * zoomLevels[zoom];
	updateScrollOffset();
}