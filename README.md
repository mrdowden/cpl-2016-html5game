# Building HTML5 Games: How to be a 2-figure Developer

Session from Code PaLOUsa 2016

GitHub: https://github.com/TwoScoopGames/building-html5-games
Slides: http://ericlathrop.com/making-javascript-games/
Made by [Two Scoop Games](http://twoscoopgames.com).

Use bfxr to create sound effects

## Intro to HTML5 Canvas
//Draw a red square on the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#f00";
ctx.fillRect(270, 190, 100, 100); //top left zero

//Draw yellow text
ctx.fillStyle = "yellow";
ctx.font = "60px sans-serif";
ctx.fillText("Hello World!", 150, 250); //Top of screen to text baseline (Vertical)
// Possible to overlap divs, shine through backgrounds, or use multiple contexts on a canvas

//Draw image
var logo = new Image();
logo.addEventListener("load", function() {
    ctx.drawImage(logo, 70, 100);
});
logo.src = "two-scoop-games-logo.png";

//Show counter
function render(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.font = "60px sans-serif";
    ctx.fillText(time, 150, 150);
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);

//Show elapsed time
var lastTime = -1;
function elapsedTime(time) {
    var elapsed = time - lastTime;
    if(lastTime === -1) {
        elapsed = 0;
    }
    lastTime = time;
    return elapsed;
}
var fps = Math.floor((1 / elapsed) * 1000) + " FPS";

//Draw Sprite
var frame = 0;
var frames = 22; //images in the filmstrip sprite
var frameWidth = img.width/frames;
var frameX = frame * frameWidth;
ctx.drawImage(img, frameX, 0, frameWidth, img.height, 260, 25, frameWidth, img.height);

//Keyboard input
var keys = {}
var keyMap = { 87: "w", 65: "a", 83: "s", 68: "d" };
window.addEventListener("keydown", function(e) {
    keys[keyMap[e.keyCode]] = true;
});
window.addEventListener("keyup", function(e) {
    keys[keyMap[e.keyCode]] = false;
});
