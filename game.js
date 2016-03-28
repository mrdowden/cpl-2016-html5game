var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
//context.fillStyle = "#f00";
//context.fillRect(270, 190, 100, 100);

var colors = [ "#ff0000", "#ee0000", "#dd0000", "#cc0000", "#bb0000", "#aa0000", "#990000" ];
var color = 0;

var keys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};
var pressed = {};

var player = { x: 50, y: 50, speed: 5 };

window.addEventListener("keydown", function(e) {
   pressed[keys[e.keyCode]] = true;
});
window.addEventListener("keyup", function(e) {
   pressed[keys[e.keyCode]] = false; 
});

var ship = new Image();
ship.src = "images/ship-f3.png";

var player = { x: 50, y: 50, speed: 0.5, friction: 0.9 };


var lastFrameTime = null;

var render = function(time) {
    if(lastFrameTime === null) {
        lastFrameTime = time;
    }
    var elapsed = time - lastFrameTime;
    lastFrameTime = time;
    
    xspeed = 0;
    yspeed = 0;
    if(pressed["left"]) {
        xspeed = -player.speed;
    }
    if(pressed["right"]) {
        xspeed = player.speed;
    }
    if(pressed["up"]) {
        yspeed = -player.speed;
    }
    if(pressed["down"]) {
        yspeed = player.speed;
    }
    xspeed *= player.friction;
    yspeed *= player.friction;
    player.x += xspeed * elapsed;
    player.y += yspeed * elapsed;
    
    //Constrain X,Y
    if(player.x < 0) player.x = 0;
    if(player.x + 50 > canvas.width) player.x = canvas.width - 50;
    if(player.y < 0) player.y = 0;
    if(player.y + 50 > canvas.height) player.y = canvas.height - 50;
    
/*    context.fillStyle = colors[color];
    color++;
    if(color >= colors.length) {
        color = 0;
    }*/
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(ship, 0, 0, ship.width, ship.height, player.x, player.y, ship.width, ship.height);
    //context.fillRect(player.x, player.y, 50, 50);
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);
