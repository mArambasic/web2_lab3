var asteroids = [];
var player;
var keys = {};
var startingTime;
var playTime = 0;
var stopTimeCount = false;
var collisionSound = new Audio('crash.mp3');
var asteroidNum = 10;


/* 
    function startGame()
    -> starting the game
    -> starting values are reset
 */
function startGame() {
    startingTime = new Date().getTime();
    asteroids = [];
    stopTimeCount = false;
    asteroidNum = 10;

    /* 
        Every three seconds a new set of asteroids are created
    */
    setInterval(function () {
        createNewAsteroids();
    }, 3000);

    createNewAsteroids();

    /*
        Creating the player rectangle in the center of the screen
     */
    myPlayer = new player(30, 30, "red", window.innerWidth / 2, window.innerHeight / 2)
    myGameArea.start();
}

/* 
    function createNewAsteroids()
    -> creates new asteroids in batches
    -> every time the function is called, it creates an additional asteroid (starting number is 10)
 */
function createNewAsteroids() {
    asteroidNum++;

    for (let i = 0; i < asteroidNum; i++) {
        /* 
            -> asteroid creation is randomized
            -> the color is chosen from 5 preselected colors
            -> the size is a number between 30 and 50
        */
        var color, xStart, yStart;
        var randomSize = Math.floor(Math.random() * (51 - 30)) + 30;
        var randomColor = Math.floor(Math.random() * 5);

        switch (randomColor) {
            case 0:
                color = "#B2BEB5"
                break;
            case 1:
                color = "#D3D3D3"
                break;
            case 2:
                color = "#818589"
                break;
            case 3:
                color = "#808080"
                break;
            case 4:
                color = "#A9A9A9"
                break;
        }


        /* 
           -> the asteroid can be created above, bellow, left or rigth of the canvas 
           -> if the y coordinate is above or bellow the canvas, x coordinate is within range of the canvas
           -> if the x coordinate is left or right of the canvas, the y coordinate is withing range of the canvas
         */
        var randomDirection = Math.floor(Math.random() * 4);
        var randomXCoordinate = Math.floor(Math.random() * window.innerWidth);
        var randomYCoordinate = Math.floor(Math.random() * window.innerHeight);
        switch (randomDirection) {
            case 0:
                xStart = window.innerWidth + 50;
                yStart = randomYCoordinate;
                break;
            case 1:
                xStart = -50;
                yStart = randomYCoordinate;
                break;
            case 2:
                xStart = randomXCoordinate;
                yStart = window.innerHeight + 50;
                break;
            case 3:
                xStart = randomXCoordinate;
                yStart = -50;
                break;
        }

        asteroids.push(new asteroid(randomSize, randomSize, color, xStart, yStart))
    }
}

/* 
    var myGameArea
    -> canvas element
*/
var myGameArea = {
    canvas: document.createElement("canvas"),
    /* 
        start
        -> the start function sets the width and height to window.innerWidth/Height - 2 due to the 1px border of the canvas
        -> the id and drawing context are set
        -> canvas is inserted as the first child in the html body
        -> every 20 miliseconds the updateGameArea function is called
     */
    start: function () {
        this.canvas.id = "myGameCanvas";
        this.canvas.width = window.innerWidth - 2;
        this.canvas.height = window.innerHeight - 2;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    /*
        stop
        -> clear the interval, updateGameArea function is no longer called, the game is stopped
     */
    stop: function () {
        clearInterval(this.interval);
    },
    /*
        clear
        -> clears the frame before drawing the new canvas after its content is updated
     */
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function asteroid(width, height, color, x, y) {
    /* 
        -> speeds for x and y coordinate changes are random numbers from 0 to 3
    */
    var random_speed_x = Math.floor(Math.random() * 3) + 1;
    var random_speed_y = Math.floor(Math.random() * 3) + 1;

    this.remove = false;
    this.width = width;
    this.height = height;
    this.speed_x = random_speed_x;
    this.speed_y = random_speed_y;
    this.x = x;
    this.y = y;

    /*
        update
        -> redraws the asteroid
        -> first it saves the current state of the canvas context
        -> position the element among the x and y axis
        -> draws a white shadow with a blur radius of 10
        -> draws and fills the rectangle of a specific height and width
        -> this.width / -2, this.height / -2 is the coordinate of the upper left corner of the rectangle
    */
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }

    /*
        newPos
        -> asteroids can move in 4 random directions 
        -> (right, up), (right, down), (left, up), (left, down)
    */
    var randomDirection = Math.floor(Math.random() * 4);
    this.newPos = function () {
        var newX = this.x, newY = this.y;
        switch (randomDirection) {
            case 0:
                newX += this.speed_x;
                newY += this.speed_y;
                break;
            case 1:
                newX += this.speed_x;
                newY -= this.speed_y;
                break;
            case 2:
                newX -= this.speed_x;
                newY += this.speed_y;
                break;
            case 3:
                newX -= this.speed_x;
                newY -= this.speed_y;
                break;
        }

        this.x = newX;
        this.y = newY;


        /*
            -> asteroids are created 50 px away from the canvas
            -> if an asteroid starts to move away not towards the canvas, it is removed from the list 
         */
        var xWithWidth = newX + this.width;
        var yWithHeight = newY + this.height

        if (xWithWidth > window.innerWidth + 60 || xWithWidth < -60
            || yWithHeight > window.innerHeight + 60 || yWithHeight < -60) {
            this.remove = true;
        }

    }
}

function player(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    /*
        same as asteroid update function
    */
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }

    /*
        moveX, moveY
        -> moves the x/y coordinate
        -> if the x/y coordinate is moving out of frame it appears on the other side of the canvas
     */
    this.moveX = function (x_move) {
        var newX = this.x + x_move

        if (newX >= myGameArea.context.canvas.width) this.x = 0;
        else if (newX <= 0) this.x = myGameArea.context.canvas.width;
        else this.x = newX;
    }
    this.moveY = function (y_move) {
        var newY = this.y + y_move

        if (newY >= myGameArea.context.canvas.height) this.y = 0;
        else if (newY <= 0) this.y = myGameArea.context.canvas.height;
        else this.y = newY;
    }
}

/*
    -> keyboard listener
    -> moving the player by 20px according to which key is pressed
 */
window.addEventListener("keydown", function (event) {
    if (event.key == "ArrowUp") {
        myPlayer.moveY(-20);
    } else if (event.key == "ArrowDown") {
        myPlayer.moveY(20);
    } else if (event.key == "ArrowLeft") {
        myPlayer.moveX(-20);
    } else if (event.key == "ArrowRight") {
        myPlayer.moveX(20);
    }
})

/* 
    -> checking whether or not the player has collided with any asteroid
    -> if it has, the collison sound is played and the stopgame function is called
*/
function checkCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        if (myPlayer.x < asteroids[i].x + asteroids[i].width
            && myPlayer.x + myPlayer.width > asteroids[i].x
            && myPlayer.y < asteroids[i].y + asteroids[i].height
            && myPlayer.y + myPlayer.height > asteroids[i].y) {
            playCollisionSound();
            stopGame();
        }
    }
}

function playCollisionSound() {
    collisionSound.play();
}

/*
    -> stopTimeCount = true, stops the current play time counter to keep counting after game is stopped
    -> game over text appears in the center of the screen
    -> game is stopped
    -> checkIfBestTime function is called
*/
function stopGame() {
    stopTimeCount = true;

    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", window.innerWidth / 2, window.innerHeight / 2);

    myGameArea.stop();
    checkIfBestTime();
}

/*
    -> if bestTime hasnt been set yet or the player reaches a new best time, playtime is saved in localstorage
*/
function checkIfBestTime() {
    stopTimeCount = true;

    if (!localStorage.getItem('bestTime') || playTime > localStorage.getItem('bestTime')) {
        localStorage.setItem('bestTime', playTime);
    }
}

/*
    -> calulates playtime if game hasnt been stopped
    -> playTime is in miliseconds so a converstion to minutes, seconds and miliseconds is neccessary
    -> minutes.toString().padStart(2, '0') turns minutes to string and adds and extra 0 at the start 
        if the number is in the single digits
*/
function displayCurrentPlayTime() {
    var currentTime = new Date().getTime();
    if (!stopTimeCount) playTime = (currentTime - startingTime);

    var minutes = Math.floor(playTime / 60000);
    var seconds = Math.floor(playTime / 1000) % 60;
    var miliseconds = playTime % 1000;

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText("Vrijeme: "
        + minutes.toString().padStart(2, '0') + ":"
        + seconds.toString().padStart(2, '0') + ":"
        + miliseconds.toString().padStart(3, '0'),
        window.innerWidth - 15, 50);
}


/*
    -> displays the best time from the local storage or 0 if the item hasnt been initialized
    -> similar to displayCurrentPlayTime()
*/
function displayBestTime() {
    var bestTime = localStorage.bestTime == null ? 0 : localStorage.bestTime;

    var minutes = Math.floor(bestTime / 60000);
    var seconds = Math.floor(bestTime / 1000) % 60;
    var miliseconds = bestTime % 1000;

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText("Najbolje vrijeme: "
        + minutes.toString().padStart(2, '0') + ":"
        + seconds.toString().padStart(2, '0') + ":"
        + miliseconds.toString().padStart(3, '0'),
        window.innerWidth - 15, 25);
}

/*
    -> function is called every 20 ms
    -> clears the game area
    -> calculates new asteroid positions
    -> filters out asteroids that are moving away from the canvas
    -> checks for collision
    -> calls the asteroid update function, myplayer update function and display time functions
 */
function updateGameArea() {
    myGameArea.clear();

    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].newPos();
    }

    asteroids = asteroids.filter(function (asteroid) {
        return !asteroid.remove
    });

    checkCollisions();

    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update();
    }

    myPlayer.update();
    displayBestTime();
    displayCurrentPlayTime()
}