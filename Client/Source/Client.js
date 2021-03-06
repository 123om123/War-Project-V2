var canvas = document.getElementById("GameCanvas");
var ctx = canvas.getContext("2d");
//Resizes canvas
function resizeCanvas() {
  var width = document.documentElement.clientWidth - 25;
  var height = document.documentElement.clientHeight - 22;
  canvas.width = width;
  canvas.height = height;
}

//Resizes canvas as soon as the page is fully loaded
window.onload = function () {
  resizeCanvas();
};

//Resizes canvas when the page is resized
window.addEventListener("resize", resizeCanvas, false);

//Player object
var Player = function (x, y, healthMax, color) {
  this.me = Math.floor(Math.random() * 1000000);
  this.x = x;
  this.y = y;
  this.width = 40;
  this.height = 40;
  this.health = 100;
  this.healthMax = healthMax;
  this.score = 0;
  this.speed = 5;
  this.movementDirection = {
    left: false,
    right: false,
    up: false,
    down: false,
  };
  this.facingDirection = {
    left: false,
    right: false,
    up: false,
    down: false,
  };
  this.lastFacingDirection = "right";
  this.color = color;
  this.bulletList = [];
  this.collisionBox = {
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height,
  };

  this.clearBullets = function () {
    if (this.bulletList.length >= 100) {
      this.bulletList.splice(0, 50);
    }
  };

  //Direction to draw the player in
  this.drawDirection = function (direction) {
    //Face left
    if (direction == "left") {
      this.collisionBox = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + 20);
      ctx.lineTo(this.x + 40, this.y);
      ctx.lineTo(this.x + 20, this.y + 20);
      ctx.lineTo(this.x + 40, this.y + 40);
      ctx.lineTo(this.x, this.y + 20);
      ctx.stroke();
      ctx.fill();
      return direction;
    }
    //Face right
    if (direction == "right") {
      this.collisionBox = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.moveTo(this.x + 40, this.y + 20);
      ctx.lineTo(this.x, this.y);
      ctx.lineTo(this.x + 20, this.y + 20);
      ctx.lineTo(this.x, this.y + 40);
      ctx.lineTo(this.x + 40, this.y + 20);
      ctx.stroke();
      ctx.fill();
      return direction;
    }
    //Face up
    if (direction == "up") {
      this.collisionBox = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.moveTo(this.x + 20, this.y);
      ctx.lineTo(this.x + 40, this.y + 40);
      ctx.lineTo(this.x + 20, this.y + 20);
      ctx.lineTo(this.x, this.y + 40);
      ctx.lineTo(this.x + 20, this.y);
      ctx.stroke();
      ctx.fill();
      return direction;
    }
    //Face down
    if (direction == "down") {
      this.collisionBox = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.moveTo(this.x + 20, this.y + 40);
      ctx.lineTo(this.x, this.y);
      ctx.lineTo(this.x + 20, this.y + 20);
      ctx.lineTo(this.x + 40, this.y);
      ctx.lineTo(this.x + 20, this.y + 40);
      ctx.stroke();
      ctx.fill();
      return direction;
    }
  };
  //Player draw function
  this.draw = function () {
    //Draw score
    ctx.fillStyle = this.color;
    ctx.fillText("Score: " + this.score, this.x, this.y + 50);

    //Draw health bar
    var healthBarWidth = (30 * this.health) / this.healthMax;
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.x + 20 - healthBarWidth / 2,
      this.y - 10,
      healthBarWidth,
      4
    );
    ctx.fillStyle = this.color;

    if (
      !this.facingDirection.right &&
      !this.facingDirection.left &&
      !this.facingDirection.up &&
      !this.facingDirection.down
    ) {
      this.drawDirection(this.lastFacingDirection);
    } else {
      for (let i in this.facingDirection) {
        if (this.facingDirection[i]) this.drawDirection(i);
      }
    }

    //Move left
    if (this.movementDirection.left) {
      this.x -= this.speed;
    }
    //Move up
    if (this.movementDirection.up) {
      this.y -= this.speed;
    }
    //Move down
    if (this.movementDirection.down) {
      this.y += this.speed;
    }
    //Move right
    if (this.movementDirection.right) {
      this.x += this.speed;
    }
  };
};

//List of all Players
Player.list = [];

//Bullet object
var Bullet = function (player, direction) {
  this.player = player;
  this.x = this.player.x;
  this.y = this.player.y;
  this.width = 15;
  this.height = this.width;
  this.speedX = 16;
  this.speedY = 16;
  this.offset = 12;
  this.radius = this.width / 2;
  this.direction = direction || this.player.lastFacingDirection;
  this.collisionBox;

  //Functions start here --------------------------------------------------------------

  if (
    !this.player.facingDirection.right &&
    !this.player.facingDirection.left &&
    !this.player.facingDirection.up &&
    !this.player.facingDirection.down &&
    typeof direction === "undefined"
  ) {
    this.direction = this.player.lastFacingDirection;
  }
  if (this.player.facingDirection.left && typeof direction === "undefined") {
    this.direction = "left";
  }
  if (this.player.facingDirection.right && typeof direction === "undefined") {
    this.direction = "right";
  }
  if (this.player.facingDirection.down && typeof direction === "undefined") {
    this.direction = "down";
  }
  if (this.player.facingDirection.up && typeof direction === "undefined") {
    this.direction = "up";
  }

  //Draws bullets
  this.draw = function () {
    ctx.fillStyle = "#0099cc";
    //draw left
    if (this.direction == "left") {
      this.collisionBox = {
        x: this.x - this.radius,
        y: this.y + this.offset,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.arc(this.x, this.y + 20, this.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    //draw up
    if (this.direction == "up") {
      this.collisionBox = {
        x: this.x + this.offset,
        y: this.y - this.radius,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.arc(this.x + 20, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    //draw right
    if (this.direction == "right") {
      this.collisionBox = {
        x: this.x + 40 - this.radius,
        y: this.y + 20 - this.radius,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.arc(this.x + 40, this.y + 20, this.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    //draw down
    if (this.direction == "down") {
      this.collisionBox = {
        x: this.x + 20 - this.radius,
        y: this.y + 40 - this.radius,
        width: this.width,
        height: this.height,
      };
      ctx.beginPath();
      ctx.arc(this.x + 20, this.y + 40, this.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  //Moves bullets
  this.move = function () {
    //Move left
    if (this.direction == "left") {
      this.x -= this.speedX;
    }
    //Move up
    if (this.direction == "up") {
      this.y -= this.speedY;
    }
    //Move right
    if (this.direction == "right") {
      this.x += this.speedX;
    }
    //Move down
    if (this.direction == "down") {
      this.y += this.speedY;
    }
  };
};

//Movement
document.onkeydown = function (e) {
  //shift (shooting Player1)
  if (e.keyCode == 16) {
    //Instantiates new Bullet object and pushes it to Player1's bulletList
    var newBullet = new Bullet(Player1);
    Player1.bulletList.push(newBullet);
    for (var u in Player1.bulletList) {
      Player1.bulletList[u].move();
      Player1.bulletList[u].draw();
    }
  }
  //alt (shooting Player2)
  if (e.keyCode == 18) {
    //Instantiates new Bullet object and pushes it to Player2's bulletList
    var newBullet = new Bullet(Player2);
    Player2.bulletList.push(newBullet);
    for (var u in Player2.bulletList) {
      Player2.bulletList[u].move();
      Player2.bulletList[u].draw();
    }
  }
  //w (up)
  if (e.keyCode == 87) {
    Player1.movementDirection.up = true;
    Player1.facingDirection.up = true;
  }
  //a (left)
  if (e.keyCode == 65) {
    Player1.movementDirection.left = true;
    Player1.facingDirection.left = true;
  }
  //s (down)
  if (e.keyCode == 83) {
    Player1.movementDirection.down = true;
    Player1.facingDirection.down = true;
  }
  //d (right)
  if (e.keyCode == 68) {
    Player1.movementDirection.right = true;
    Player1.facingDirection.right = true;
  }
  //up arrow (up)
  if (e.key == "ArrowUp") {
    Player2.movementDirection.up = true;
    Player2.facingDirection.up = true;
  }
  //a (left)
  if (e.key == "ArrowLeft") {
    Player2.movementDirection.left = true;
    Player2.facingDirection.left = true;
  }
  //s (down)
  if (e.key == "ArrowDown") {
    Player2.movementDirection.down = true;
    Player2.facingDirection.down = true;
  }
  //d (right)
  if (e.key == "ArrowRight") {
    Player2.movementDirection.right = true;
    Player2.facingDirection.right = true;
  }

  //directional left and right shooting for Player1
  if (
    Player1.facingDirection.left &&
    Player1.facingDirection.right &&
    e.keyCode == 16
  ) {
    Player1.movementDirection.left = true;
    Player1.facingDirection.left = true;
    Player1.movementDirection.right = true;
    Player1.facingDirection.right = true;
    var leftBullet = new Bullet(Player1, "left");
    var rightBullet = new Bullet(Player1, "right");
    Player1.bulletList.push(leftBullet, rightBullet);
  }

  //directional left and right shooting for Player2
  if (
    Player2.facingDirection.left &&
    Player2.facingDirection.right &&
    e.keyCode == 18
  ) {
    Player2.movementDirection.left = true;
    Player2.facingDirection.left = true;
    Player2.movementDirection.right = true;
    Player2.facingDirection.right = true;
    var leftBullet = new Bullet(Player2, "left");
    var rightBullet = new Bullet(Player2, "right");
    Player2.bulletList.push(leftBullet, rightBullet);
  }

  //directional left and up shooting for Player1
  if (
    Player1.facingDirection.left &&
    Player1.facingDirection.up &&
    e.keyCode == 16
  ) {
    Player1.movementDirection.left = true;
    Player1.facingDirection.left = true;
    Player1.movementDirection.up = true;
    Player1.facingDirection.up = true;
    var leftBullet = new Bullet(Player1, "left");
    var upBullet = new Bullet(Player1, "up");
    Player1.bulletList.push(leftBullet, upBullet);
  }

  //directional left and up shooting for Player2
  if (
    Player2.facingDirection.left &&
    Player2.facingDirection.up &&
    e.keyCode == 18
  ) {
    Player2.movementDirection.left = true;
    Player2.facingDirection.left = true;
    Player2.movementDirection.up = true;
    Player2.facingDirection.up = true;
    var leftBullet = new Bullet(Player2, "left");
    var upBullet = new Bullet(Player2, "up");
    Player2.bulletList.push(leftBullet, upBullet);
  }
  //directional left and down shooting for Player1
  if (
    Player1.facingDirection.left &&
    Player1.facingDirection.down &&
    e.keyCode == 16
  ) {
    Player1.movementDirection.left = true;
    Player1.facingDirection.left = true;
    Player1.movementDirection.down = true;
    Player1.facingDirection.down = true;
    var leftBullet = new Bullet(Player1, "left");
    var downBullet = new Bullet(Player1, "down");
    Player1.bulletList.push(leftBullet, downBullet);
  }

  //directional left and down shooting for Player2
  if (
    Player2.facingDirection.left &&
    Player2.facingDirection.down &&
    e.keyCode == 18
  ) {
    Player2.movementDirection.left = true;
    Player2.facingDirection.left = true;
    Player2.movementDirection.down = true;
    Player2.facingDirection.down = true;
    var leftBullet = new Bullet(Player2, "left");
    var downBullet = new Bullet(Player2, "down");
    Player2.bulletList.push(leftBullet, downBullet);
  }
  //directional right and up shooting for Player1
  if (
    Player1.facingDirection.up &&
    Player1.facingDirection.right &&
    e.keyCode == 16
  ) {
    Player1.movementDirection.up = true;
    Player1.facingDirection.up = true;
    Player1.movementDirection.right = true;
    Player1.facingDirection.right = true;
    var upBullet = new Bullet(Player1, "up");
    var rightBullet = new Bullet(Player1, "right");
    Player1.bulletList.push(upBullet, rightBullet);
  }

  //directional up and right shooting for Player2
  if (
    Player2.facingDirection.up &&
    Player2.facingDirection.right &&
    e.keyCode == 18
  ) {
    Player2.movementDirection.up = true;
    Player2.facingDirection.up = true;
    Player2.movementDirection.right = true;
    Player2.facingDirection.right = true;
    var upBullet = new Bullet(Player2, "up");
    var rightBullet = new Bullet(Player2, "right");
    Player2.bulletList.push(upBullet, rightBullet);
  }
  //directional down and right shooting for Player1
  if (
    Player1.facingDirection.down &&
    Player1.facingDirection.right &&
    e.keyCode == 16
  ) {
    Player1.movementDirection.down = true;
    Player1.facingDirection.down = true;
    Player1.movementDirection.right = true;
    Player1.facingDirection.right = true;
    var downBullet = new Bullet(Player1, "down");
    var rightBullet = new Bullet(Player1, "right");
    Player1.bulletList.push(downBullet, rightBullet);
  }

  //directional down and right shooting for Player2
  if (
    Player2.facingDirection.down &&
    Player2.facingDirection.right &&
    e.keyCode == 18
  ) {
    Player2.movementDirection.down = true;
    Player2.facingDirection.down = true;
    Player2.movementDirection.right = true;
    Player2.facingDirection.right = true;
    var downBullet = new Bullet(Player2, "down");
    var rightBullet = new Bullet(Player2, "right");
    Player2.bulletList.push(downBullet, rightBullet);
  }

  //directional up and down shooting for Player1
  if (
    Player1.facingDirection.up &&
    Player1.facingDirection.down &&
    e.keyCode == 16
  ) {
    Player1.movementDirection.up = true;
    Player1.facingDirection.up = true;
    Player1.movementDirection.down = true;
    Player1.facingDirection.down = true;
    var upBullet = new Bullet(Player1, "up");
    var downBullet = new Bullet(Player1, "down");
    Player1.bulletList.push(upBullet, downBullet);
  }

  //directional up and down shooting for Player2
  if (
    Player2.facingDirection.up &&
    Player2.facingDirection.down &&
    e.keyCode == 18
  ) {
    Player2.movementDirection.up = true;
    Player2.facingDirection.up = true;
    Player2.movementDirection.down = true;
    Player2.facingDirection.down = true;
    var upBullet = new Bullet(Player2, "up");
    var downBullet = new Bullet(Player2, "down");
    Player2.bulletList.push(upBullet, downBullet);
  }

  //all direction shooting for Player1
  if (
    Player1.facingDirection.left &&
    Player1.facingDirection.right &&
    Player1.facingDirection.up &&
    Player1.facingDirection.down &&
    e.keyCode == 16
  ) {
    Player1.movementDirection.left = true;
    Player1.facingDirection.left = true;
    Player1.movementDirection.right = true;
    Player1.facingDirection.right = true;
    Player1.movementDirection.up = true;
    Player1.facingDirection.up = true;
    Player1.movementDirection.down = true;
    Player1.facingDirection.down = true;
    var leftBullet = new Bullet(Player1, "left");
    var rightBullet = new Bullet(Player1, "right");
    var upBullet = new Bullet(Player1, "up");
    var downBullet = new Bullet(Player1, "down");
    Player1.bulletList.push(leftBullet, rightBullet, upBullet, downBullet);
  }

  //all direction shooting for Player2
  if (
    Player2.facingDirection.left &&
    Player2.facingDirection.right &&
    Player2.facingDirection.up &&
    Player2.facingDirection.down &&
    e.keyCode == 18
  ) {
    Player2.movementDirection.left = true;
    Player2.facingDirection.left = true;
    Player2.movementDirection.right = true;
    Player2.facingDirection.right = true;
    Player2.movementDirection.up = true;
    Player2.facingDirection.up = true;
    Player2.movementDirection.down = true;
    Player2.facingDirection.down = true;
    var leftBullet = new Bullet(Player2, "left");
    var rightBullet = new Bullet(Player2, "right");
    var upBullet = new Bullet(Player2, "up");
    var downBullet = new Bullet(Player2, "down");
    Player2.bulletList.push(leftBullet, rightBullet, upBullet, downBullet);
  }
};

document.onkeyup = function (e) {
  //w (up)
  if (e.keyCode == 87) {
    Player1.movementDirection.up = false;
    Player1.facingDirection.up = false;
    Player1.lastFacingDirection = "up";
  }
  //a (left)
  if (e.keyCode == 65) {
    Player1.movementDirection.left = false;
    Player1.facingDirection.left = false;
    Player1.lastFacingDirection = "left";
  }
  //s (down)
  if (e.keyCode == 83) {
    Player1.movementDirection.down = false;
    Player1.facingDirection.down = false;
    Player1.lastFacingDirection = "down";
  }
  //d (right)
  if (e.keyCode == 68) {
    Player1.movementDirection.right = false;
    Player1.facingDirection.right = false;
    Player1.lastFacingDirection = "right";
  }
  //w (up)
  if (e.key == "ArrowUp") {
    Player2.movementDirection.up = false;
    Player2.facingDirection.up = false;
    Player2.lastFacingDirection = "up";
  }
  //a (left)
  if (e.key == "ArrowLeft") {
    Player2.movementDirection.left = false;
    Player2.facingDirection.left = false;
    Player2.lastFacingDirection = "left";
  }
  //s (down)
  if (e.key == "ArrowDown") {
    Player2.movementDirection.down = false;
    Player2.facingDirection.down = false;
    Player2.lastFacingDirection = "down";
  }
  //d (right)
  if (e.key == "ArrowRight") {
    Player2.movementDirection.right = false;
    Player2.facingDirection.right = false;
    Player2.lastFacingDirection = "right";
  }
};

//Collision checking
var checkCollision = function (object1, object2) {
  //object1's x
  var x1 = object1.collisionBox.x;
  //object1's y
  var y1 = object1.collisionBox.y;
  //object1's width
  var width1 = object1.collisionBox.width;
  //object1's height
  var height1 = object1.collisionBox.height;
  //object2's x
  var x2 = object2.collisionBox.x;
  //object2's y
  var y2 = object2.collisionBox.y;
  //object2's width
  var width2 = object2.collisionBox.width;
  //object2's height
  var height2 = object2.collisionBox.height;

  // ctx.strokeStyle = "red";
  // ctx.strokeRect(x1, y1, width1, height1);

  //collision checker
  if (
    x1 <= x2 + width2 &&
    x1 + width1 >= x2 &&
    y1 <= y2 + height2 &&
    y1 + height1 >= y2
  ) {
    return true;
  }
};

//Instantiates Player object
var Player1 = new Player(20, 20, 100, "black");
var Player2 = new Player(200, 20, 100, "green");
Player.list.push(Player1, Player2);

//Drawing loop !!IMPORTANT: ALL DRAWING WILL OCCUR HERE!!
var Drawing_loop = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i in Player.list) {
    Player.list[i].draw();
    Player.list[i].clearBullets();
    for (var u in Player.list[i].bulletList) {
      Player.list[i].bulletList[u].move();
      Player.list[i].bulletList[u].draw();

      //Check if Player2 is hitting Player1
      if (Player2.bulletList.length > 0) {
        if (Player2.bulletList[u]) {
          if (Player2.bulletList[u].collisionBox) {
            //checks for collision between player and bullets
            checkCollision(Player2.bulletList[u], Player1);
            if (checkCollision(Player2.bulletList[u], Player1)) {
              //removes bullet from array
              Player2.bulletList.splice(u, 1);
              //reduces Player1's health
              Player1.health -= 10;
              //respawns Player1 with full health in a different area and increases Player2's score by one
              if (Player1.health <= 0) {
                Player1.x = Math.floor(Math.random() * canvas.width);
                Player1.y = Math.floor(Math.random() * canvas.height);
                Player1.health = 100;
                Player2.score += 1;
              }
            }
          }
        }
      }
      //Check if Player1 is hitting Player2
      if (Player1.bulletList.length > 0) {
        if (Player1.bulletList[u]) {
          if (Player1.bulletList[u].collisionBox) {
            //checks for collision between player and bullets
            checkCollision(Player1.bulletList[u], Player2);
            if (checkCollision(Player1.bulletList[u], Player2)) {
              //removes bullet from array
              Player1.bulletList.splice(u, 1);
              //reduces Player2's health
              Player2.health -= 10;
              //respawns Player2 with full health in a different area and increases Player1's score by one
              if (Player2.health <= 0) {
                Player2.x = Math.floor(Math.random() * canvas.width);
                Player2.y = Math.floor(Math.random() * canvas.height);
                Player2.health = 100;
                Player1.score += 1;
              }
            }
          }
        }
      }
    }
  }
};

//Game loop !!ALL NECESSARY FUNCTIONS WILL BE CALLED HERE!!
var Game_loop = function () {
  Drawing_loop();
};

//Set interval !!LOOPS EVERYTHING IN GAME LOOP!!
setInterval(function () {
  Game_loop();
}, 10);
