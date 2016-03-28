var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
//context.fillStyle = "#f00";
//context.fillRect(270, 190, 100, 100);

var colors = [ "#ff0000", "#ee0000", "#dd0000", "#cc0000", "#bb0000", "#aa0000", "#990000" ];
var color = 0;

var keys = {
    32: "space",
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

var player = { x: 50, y: 500, speed: 0.5, friction: 0.9 };

var animations = {
    ship: {
        image: new Image(),
        frame: 0,
        frames: 3,
        frameWidth: 204 / 3,
        time: 0,
        speed: 200
    },
    bullet: {
        image: new Image(),
        frame: 0,
        frames: 5,
        frameWidth: 55 / 5,
        time: 0,
        speed: 100
    },
    meteor: {
        image: new Image(),
        frame: 0,
        frames: 4,
        frameWidth: 320 / 4,
        time: 0,
        speed: 300
    }
};
animations.ship.image.src = "images/ship-f3.png";
animations.bullet.image.src = "images/bullet-f5.png";
animations.meteor.image.src = "images/meteor-f4.png";

var advanceAnimations = function(elapsed) {
    Object.keys(animations).forEach(function(name) {
        var anim = animations[name];
        anim.time += elapsed;
        while(anim.time > anim.speed) {
            anim.time -= anim.speed;
            anim.frame++;
            if(anim.frame >= anim.frames) {
                anim.frame = 0;
            }
        }
        anim.x = anim.frame * anim.frameWidth;
    });
}
var drawAnimation = function(context, name, x, y) {
    var anim = animations[name];
    context.drawImage(anim.image, anim.x, 0, anim.frameWidth, anim.image.height, x, y, anim.frameWidth, anim.image.height);
}

var bullets = [];
var meteors = [];
var lastFrameTime = null;

var render = function(time) {
    if(lastFrameTime === null) {
        lastFrameTime = time;
    }
    var elapsed = time - lastFrameTime;
    lastFrameTime = time;
    
    advanceAnimations(elapsed);
    
    //Spawn Meteors
    while (meteors.length < 1) {
        meteors.push({
            x: Math.floor(Math.random() * (canvas.width - animations.meteor.frameWidth)),
            y: -animations.meteor.image.height
        });
    }
    
    var xspeed = 0, yspeed = 0;
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
    if(pressed["space"]) {
        bullets.push({
            x: player.x + (animations.ship.frameWidth / 2) - (animations.bullet.frameWidth / 2),
            y: player.y - animations.bullet.image.height
        });
    }
    
    //xspeed *= player.friction;
    //yspeed *= player.friction;
    player.x += xspeed * elapsed;
    player.y += yspeed * elapsed;
    
    //Constrain X,Y
    if(player.x < 0) player.x = 0;
    if(player.x + animations.ship.frameWidth > canvas.width) player.x = canvas.width - animations.ship.frameWidth;
    if(player.y < 0) player.y = 0;
    if(player.y + animations.ship.image.height > canvas.height) player.y = canvas.height - animations.ship.image.height;
    
/*    context.fillStyle = colors[color];
    color++;
    if(color >= colors.length) {
        color = 0;
    }*/
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawAnimation(context, "ship", player.x, player.y);
    for(var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        drawAnimation(context, "bullet", bullet.x, bullet.y);
        bullet.y -= 1 * elapsed;
    }
    for(var i = 0; i < meteors.length; i++) {
        var meteor = meteors[i];
        drawAnimation(context, "meteor", meteor.x, meteor.y);
        meteor.y += 1 * elapsed;
        if(meteor.y > canvas.height) {
            meteors.splice(i, 1);
            i--;
        }
    }
    //context.drawImage(ship, 0, 0, ship.width, ship.height, player.x, player.y, ship.width, ship.height);
    //context.fillRect(player.x, player.y, 50, 50);
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);
