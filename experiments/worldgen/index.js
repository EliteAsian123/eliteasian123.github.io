const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const simplex = new SimplexNoise(Math.random());

var size = 256;

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var seaLevel = document.getElementById("seaLevel");
var beachAmount = document.getElementById("beachAmount");
var landHeight = document.getElementById("landHeight");
var waterDepth = document.getElementById("waterDepth");
var sizeSelect = document.getElementById("size");

var view = {xOffset: Math.floor(canvas.clientWidth / 2) - size, yOffset: Math.floor(canvas.clientHeight / 2) - size, scale: 2};

var mouseInfo = {downLeft: false, startDownX: 0, startDownY: 0, startDownXWorld: 0, startDownYWorld: 0, x: 0, y: 0};

var terrain = [];

var personId = 0;

canvas.addEventListener("mousemove", e => {
    if (mouseInfo.downLeft) {
        view.xOffset = e.clientX - mouseInfo.startDownXWorld;
        view.yOffset = e.clientY - mouseInfo.startDownYWorld;
    }

    mouseInfo.x = e.clientX;
    mouseInfo.y = e.clientY;
});

canvas.addEventListener("mousedown", e => {
    if (e.button == 0)
        mouseInfo.downLeft = true;

    mouseInfo.startDownX = e.clientX;
    mouseInfo.startDownY = e.clientY;

    mouseInfo.startDownXWorld = e.clientX - view.xOffset;
    mouseInfo.startDownYWorld = e.clientY - view.yOffset;
});

canvas.addEventListener("mouseup", e => {
    if (e.button == 0)
        mouseInfo.downLeft = false;
});

canvas.addEventListener("wheel", e => {
    if (event.deltaY < 0 && view.scale < 8) {
        view.scale *= 1.5;
    }

    if (event.deltaY > 0 && view.scale > 0.125) {
        view.scale /= 1.5;
    }
});

document.addEventListener("contextmenu", e => e.preventDefault());

var imageBitmap = new Image();

reheight();
recreateImage();

function reheight() {
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            var height = generatePointNoise(x, y, 100, 8, 0.5, 2);
            terrain[xyToIndex(x, y)] = {height: height, type: height <= (seaLevel.value / 100) ? "water" : "grass"};
        }
    }
}

function recolor() {
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            terrain[xyToIndex(x, y)].type = (terrain[xyToIndex(x, y)].height <= (seaLevel.value / 100) ? "water" : "grass");
        }
    }
}

function recreateImage() {
    var imageData = ctx.createImageData(size, size);
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            var color = getPointColor(x, y);

            var pos = xyToIndex(x, y) * 4;

            imageData.data[pos + 0] = floatToByte(color[0]);
            imageData.data[pos + 1] = floatToByte(color[1]);
            imageData.data[pos + 2] = floatToByte(color[2]);
            imageData.data[pos + 3] = 255;
        }
    }

    createImageBitmap(imageData).then(r => {
        imageBitmap = r;
    });
}

seaLevel.oninput = function() {
    recolor();
    recreateImage();
}

beachAmount.oninput = function() {
    recolor();
    recreateImage();
}

landHeight.oninput = function() {
    recolor();
    recreateImage();
}

waterDepth.oninput = function() {
    recolor();
    recreateImage();
}

sizeSelect.onchange = function() {
    if (sizeSelect.value == "small") {
        size = 256;
    } else if (sizeSelect.value == "medium") {
        size = 512;
    } else if (sizeSelect.value == "large") {
        size = 1024;
    } else {
        console.error("invalid size");
    }

    terrain = [];
    reheight();
    recreateImage();
}

function render() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    ctx.drawImage(imageBitmap, 0, 0, size, size, view.xOffset, view.yOffset, size * view.scale, size * view.scale);
    
    window.requestAnimationFrame(render);
}

function generatePointNoise(x, y, scale, octaves, persistence, lacunarity) {
    var total = 0;
    var totalAmplitude = 0;

    var frequency = 1;
    var amplitude = 1;

    for (var i = 0; i < octaves; i++) {
        var nx = x / scale;
        var ny = y / scale;

        total += simplex.noise2D(nx * frequency, ny * frequency) * amplitude;
        totalAmplitude += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    return ((total / totalAmplitude) + 1) / 2;
}

function xyToIndex(x, y) {
    return y * size + x;
}

function getPointColor(x, y) {
    var height = terrain[xyToIndex(x, y)].height;
    var type = terrain[xyToIndex(x, y)].type;
    var sl = seaLevel.value / 100;

    if (type == "water") {
        if (height <= sl - ((100 - waterDepth.value) / 100))
            return [0.16, 0.49, 0.78];
        else
            return [0.2, 0.54, 0.85];
    } else {
        if (height <= sl + (beachAmount.value / 100))
            return [0.9, 0.9, 0.56];
        else if (height <= sl + (beachAmount.value / 100) + (landHeight.value / 100))
            return [0.12, 0.75, 0.1];
        else if (height <= sl + (beachAmount.value / 100) + (landHeight.value / 100) + 0.1)
            return [0.11, 0.69, 0.09];
        else
            return [0.12, 0.62, 0.1];
    }
}

function floatToByte(c) {
    return Math.floor(c * 255);
}

function getPointOnTerrain(x, y) {
    return [x * view.scale + view.xOffset, y * view.scale + view.yOffset];
}

window.requestAnimationFrame(render);