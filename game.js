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

// Sounds
var explode = new Audio();
explode.src = "sounds/explode.wav";
explode.load();

var laser = new Audio();
laser.src = "sounds/laser.wav";
laser.load();

var playSound = function(sound) {
  var s = sound.cloneNode(true);
  s.play();
}

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
var overlaps = function(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 + w1 > x2 && x1 < x2 + w2 &&
    y1 + h1 > y2 && y1 < y2 + h2;
}

var bullets = [];
var meteors = [];
var lastFrameTime = null;
var fireTimerMax = 100;
var fireTimer = fireTimerMax;
var score = 0;
var shotsFired = 0;
var meteorsAvoided = 0;
var gameOver = false;
var startupDelay = 5000;

var render = function(time) {
    if(lastFrameTime === null) {
        lastFrameTime = time;
    }
    var elapsed = time - lastFrameTime;
    lastFrameTime = time;
    
    advanceAnimations(elapsed);
    fireTimer += elapsed;
    
    if(!gameOver) {
        //Spawn Meteors
        if(time > startupDelay) {
            while (meteors.length < 3) {
                meteors.push({
                    x: Math.floor(Math.random() * (canvas.width - animations.meteor.frameWidth)),
                    y: -animations.meteor.image.height - Math.floor(Math.random() * 300),
              speed: 0.3 + Math.random()
                });
            }
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
        if(pressed["space"] && fireTimer > fireTimerMax) {
            playSound(laser);
            fireTimer = 0;
            bullets.push({
                x: player.x + (animations.ship.frameWidth / 2) - (animations.bullet.frameWidth / 2),
                y: player.y - animations.bullet.image.height
            });
            shotsFired++;
        }
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
    
    //Clear screen
    context.clearRect(0, 0, canvas.width, canvas.height);
    //Draw ship
    if(!gameOver) {
        drawAnimation(context, "ship", player.x, player.y);
    }
    //Draw bullets
    for(var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        drawAnimation(context, "bullet", bullet.x, bullet.y);
        bullet.y -= 1 * elapsed;
        //Remove off-screen bullets
        if(bullet.y < -animations.bullet.image.height) {
            bullets.splice(i, 1);
            i--;
            continue;
        }
        //Detect collisions
        for(var j = 0; j < meteors.length; j++) {
            var meteor = meteors[j];
            if(overlaps(bullet.x, bullet.y, animations.bullet.frameWidth, animations.bullet.image.height, meteor.x, meteor.y, animations.meteor.frameWidth, animations.meteor.image.height)) {
                playSound(explode);
                score++;
                bullets.splice(i, 1);
                meteors.splice(j, 1);
                j--; i--;
            }
        }
    }
    //Draw meteors
    for(var i = 0; i < meteors.length; i++) {
        var meteor = meteors[i];
        drawAnimation(context, "meteor", meteor.x, meteor.y);
        meteor.y += 1 * elapsed;
        if(meteor.y > canvas.height) {
            meteorsAvoided++;
            meteors.splice(i, 1);
            i--;
        }
        if (!gameOver && overlaps(player.x, player.y, animations.ship.frameWidth, animations.ship.image.height, meteor.x, meteor.y, animations.meteor.frameWidth, animations.meteor.image.height)) {
          gameOver = true;
          playSound(explode);
        }
    }
    
    context.fillStyle = "#fff";
    context.font = "25px helvetica";
    context.fillText("SCORE: " + Math.max(0, score*10-shotsFired+meteorsAvoided), 50, 50);
    context.fillText("FIRED: " + shotsFired, 50, 75);
    context.fillText("AVOIDED: " + meteorsAvoided, 50, 100);
     
    if (gameOver) {
        context.fillStyle = "#fff";
        context.fillText("GAME OVER", 300, 300);
    }
     
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);
