// Define canvas and context variables
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
var elapsedTime = 0;
// Define game state variables
var startTime; // Variable to store the start time of the game
var score = 0; // Variable to store the score
var highScore = 0; // Variable to store the high score
// Define the available ball colors
var ballColors = [
    "images/player1.jpg", "images/player2.jpg", "images/player3.jpg",
    "images/player4.jpg", "images/player5.jpg", "images/player6.jpg",
    "images/player7.jpg", "images/player8.jpg"];
var selectedColor = 0; // Variable to store the index of the selected color
var playerImage; 



var gravityFlipTime = 0; // Variable to store the current time for gravity flip
var nextGravityFlip = getRandomFlipTime(); // Variable to store the next time when gravity should flip
var flipMessage = ""; // Variable to store the flip message
var flipMessageDuration = 1500; // Duration in milliseconds
var flipMessageTimer = 0; // Variable to track the flip message timer
// Create a new image object
var obstacleImage = new Image();
obstacleImage.src = "images/obsbck.jpg";

// Wait for the image to load
obstacleImage.onload = function() {
  // Call the function to start the game or perform any other necessary actions
  drawStartScreen();
};



// Define player object
var player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: Math.min(canvas.width, canvas.height) * 0.035,
  speed: Math.min(canvas.width, canvas.height) * 0.01,
  velocityY: 0,
};

// Define gravity variable
var gravity = Math.min(canvas.width, canvas.height) * 0.0004;

// Define obstacle array
var obstacles = [];

// Define game state variables
var isGameStarted = false;
var isGameOver = false;

// Event listener for keydown event to start the game
document.addEventListener("keydown", handleKeyDown);


function handleKeyDown(event) {
  if (!isGameStarted) {
    isGameStarted = true;
    startGame();
  }
}

// Function to start the game
// Move the canvas display and event listener setup to the startGame function
function startGame() {
    // Hide the start screen
    var startScreen = document.getElementById("startScreen");
    startScreen.style.display = "none";
  
    // Show the game canvas
    canvas.style.display = "block";
  
    // Set the canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  
    // Set up the canvas click event listener
    canvas.addEventListener("click", handleCanvasClick);
  
    // Reset player speed to its initial value
    player.speed = Math.min(canvas.width, canvas.height) * 0.01;
  
    // Start the game loop
    gameLoop();
  }
  
// Handle canvas click event
// Handle canvas click event

function handleCanvasClick(event) {
    if (!isGameStarted) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var mouseX = (event.clientX - rect.left) * scaleX;
      var mouseY = (event.clientY - rect.top) * scaleY;
  
      // Check if the click is inside any color option
      for (var i = 0; i < ballColors.length; i++) {
        var radius = 40;
        var x = canvas.width / 2 - (radius * 2 + 250) + (i * (radius * 2 + 20));
        var y = canvas.height / 2 + 40;
  
        // Calculate the distance between the click position and the center of the color circle
        var distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
  
        // Check if the click is inside the color circle
        if (distance <= radius) {
          selectColor(i);
          break;
        }
      }
  
       // Start the game after selecting the color
    }
  }
  

  
  
// Game loop

function gameLoop(timestamp) {
    if (!startTime) {
      startTime = timestamp; // Set the start time if it is not set already
    }
  
    // Calculate elapsed time in seconds
    elapsedTime = (timestamp - startTime) / 1000;
  
    // Update game logic
    updatePlayer();
    updateObstacles();
  
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw game objects
    drawPlayer();
    drawObstacles();
    drawScore();
  
    // Check if it's time to flip the gravity
    if (elapsedTime >= nextGravityFlip) {
      flipGravity(); // Flip the gravity
      nextGravityFlip = elapsedTime + getRandomFlipTime(); // Set the next time for gravity flip
      flipMessageTimer = 60; // Set the flip message timer (in frames)
    }
  
    // Update and display the flip message
    if (flipMessageTimer > 0) {
      displayFlipMessage();
      flipMessageTimer--;
    }
  
    // Check game over condition
    if (isGameOver) {
      endGame();
    } else {
      requestAnimationFrame(gameLoop);
    }
  }
  
  function displayFlipMessage() {
    context.fillStyle = "#ffffff";
    context.font = "80px Arial";
    context.textAlign = "center";
    context.fillText(flipMessage, canvas.width / 2, canvas.height / 2);
  }
    // Function to draw the score on the canvas
    function drawScore() {
        context.fillStyle = "#ffffff";
        context.font = "20px Arial";
        context.textAlign = "left";
        context.fillText("Score: " + score, 10, 30);
        //context.fillText("Score: " + Math.floor(score), 10, 30);
    }

    function updateScore() {
        score += 1; // Increase the score by 1
      
        // Update the high score if the current score is higher
        if (score > highScore) {
          highScore = score;
        }
      }

    // Update player position and apply gravity effects
    function updatePlayer() {
        player.y += player.velocityY;
      
        player.velocityY += gravity;
      
        // Check if the player reaches the bottom or top of the canvas
        if (player.y + player.radius > canvas.height) {
          player.y = canvas.height - player.radius; // Set the player's position to the maximum height
          player.velocityY = 0; // Stop the player's vertical velocity
        } else if (player.y - player.radius < 0) {
          player.y = player.radius; // Set the player's position to the minimum height
          player.velocityY = 0; // Stop the player's vertical velocity
        }
      
        // Update player's speed in the x direction based on elapsed time
        player.speed += 0.005; // Increase speed gradually
      
        // Implement collision detection logic here
        checkCollision();

        // Update the score
        updateScore();
      }

// Function to handle player input for controlling vertical movement
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === "w") {
      player.velocityY = -12;
    } else if (event.key === "ArrowDown" || event.key === "s") {
      player.velocityY = 12;
    }
  });
  
  // Function to handle releasing keys and stopping vertical movement
  document.addEventListener("keyup", function (event) {
    if (
      event.key === "ArrowUp" ||
      event.key === "w" ||
      event.key === "ArrowDown" ||
      event.key === "s"
    ) {
      player.velocityY = 0;
    }
  });

// Update obstacles position and check for collisions
// Function to update obstacles
function updateObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
      var obstacle = obstacles[i];
      obstacle.x -= player.speed; // Move the obstacle towards the left
  
      // Check for collision with the player
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.radius > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.radius > obstacle.y
      ) {
        isGameOver = true; // Set game over flag
      }
  
      // Remove obstacles that are off the screen
      if (obstacle.x + obstacle.width < 0) {
        obstacles.splice(i, 1);
        i--;
      }
    }
  
    // Generate new obstacles at regular intervals
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
      generateObstacle();
    }
  }

// Function to generate obstacles
function generateObstacle() {
    var obstacleWidth = canvas.width * 0.0003 * Math.random() * 100 + 30;
    var maxHeight = canvas.height / 2; // Maximum obstacle height
    var obstacleHeight = Math.random() * maxHeight; // Random obstacle height
    var obstacleY = Math.random() < 0.5 ? 0 : canvas.height - obstacleHeight;
    var obstacle = {
      x: canvas.width,
      y: obstacleY,
      width: obstacleWidth,
      height: obstacleHeight,
    };
    obstacles.push(obstacle);
  }
  

// Function to check collision between player and obstacles
function checkCollision() {
    // Check collision with obstacles
    for (var i = 0; i < obstacles.length; i++) {
      var obstacle = obstacles[i];
  
      if (
        player.x + player.radius > obstacle.x &&
        player.x - player.radius < obstacle.x + obstacle.width &&
        player.y + player.radius > obstacle.y &&
        player.y - player.radius < obstacle.y + obstacle.height
      ) {
        isGameOver = true;
        break;
      }
    }
  
    // Check collision with the ground and roof
    if (
      player.y + player.radius == canvas.height ||
      player.y - player.radius == 0
    ) {
      isGameOver = true;
    }
  }
  

// Draw player on the canvas

function drawPlayer() {
    context.save();
    context.beginPath();
    context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    context.drawImage(playerImage, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
    context.restore();
  }

// Draw obstacles on the canvas
function drawObstacles() {
    // Draw the obstacles using the image
    for (var i = 0; i < obstacles.length; i++) {
      var obstacle = obstacles[i];
      context.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }

function getRandomFlipTime() {
    return Math.random() * (10 - 5) + 5; // Generate a random time between 5 and 10 seconds
  }
  
function flipGravity() {
    gravity = -gravity; // Invert the gravity value
    player.velocityY = -player.velocityY; // Invert the player's vertical velocity
    flipMessage = "Gravity Flipped!"; // Set the flip message
  }
  

function endGame() {
    // Stop any ongoing game processes, reset the game, etc.
    isGameOver = true;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGameOverText();
  
    // Add event listener to restart the game on any key press
    document.addEventListener("keydown", handleRestart);
  }


// Function to reset the game state
// Function to reset the game state
function resetGame() {
    // Reset player position and velocity
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.velocityY = 0;
  
    // Reset player speed
    player.speed = Math.min(canvas.width, canvas.height) * 0.01;
  
    // Clear the obstacle array
    obstacles = [];
  
    // Reset game state variables
    isGameOver = false;
  
    // Reset the score
    score = 0;
    elapsedTime = 0;
    gravityFlipTime = 0;
    startTime = false;
    gravity = Math.min(canvas.width, canvas.height) * 0.0005;
  }
  

  // Function to handle game restart
// Function to handle game restart
function handleRestart(event) {
    if (isGameOver) {
      resetGame(); // Reset the game state
      startGame(); // Start the game again
    }
  }
  
  // Add event listener to restart the game on any key press
  document.addEventListener("keydown", handleRestart, { once: true });
  
  // Draw game over text on the canvas
  function drawGameOverText() {
    context.fillStyle = "#ffffff";
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    
    // Display the high score message
    context.font = "20px Arial";
    context.fillText("High Score: " + Math.floor(highScore), canvas.width / 2, canvas.height / 2 + 50);
    
    context.fillText("Press any key to restart the game", canvas.width / 2, canvas.height / 2 + 100);
  }
  

// Initialize the game
function init() {
  drawStartScreen();
}

function drawStartScreen() {
    canvas.style.display = "block";
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    context.fillStyle = "#ffffff";
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillText("Gravity Shift", canvas.width / 2, canvas.height / 2 - 80);
  
    context.font = "20px Arial";
    context.fillText("Choose Player:", canvas.width / 2, canvas.height / 2 - 40);
  
    // Draw the image options as circles
    for (var i = 0; i < ballColors.length; i++) {
      var color = ballColors[i];
      var radius = 40;
      var x = canvas.width / 2 - (radius * 2 + 250) + (i * (radius * 2 + 20));
      var y = canvas.height / 2 + 40;
  
      drawImageCircle(color, x, y, radius);
  
      // Draw the selection border
      if (i === selectedColor) {
        context.lineWidth = 4;
        context.strokeStyle = "#ffffff";
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.stroke();
  
        // Set the chosen player image
        playerImage = new Image();
        playerImage.src = color;
      }
    }
  
    context.font = "20px Arial";
    context.fillText("Press any key to start", canvas.width / 2, canvas.height / 2 + 120);
  }
    
  function drawImageCircle(imageSrc, x, y, radius) {
    var image = new Image();
    image.onload = function () {
      context.save();
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.closePath();
      context.clip();
      context.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
      context.restore();
    };
    image.src = imageSrc;
  }    
  
  
  
  
  // Function to handle color selection
// Function to handle color selection
// Function to handle color selection
function selectColor(index) {
    selectedColor = index;
  
    // Clear the canvas and redraw the start screen
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStartScreen();
  }
  
  // Event listener for key press to start the game or select color
// Event listener for click event to select color and start the game

  
  // Update player color based on the selected color
  function drawPlayer() {
    if (playerImage) {
      context.save();
      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      context.closePath();
      context.clip(); // Clip the drawing region to the circular path
      context.drawImage(playerImage, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);
      context.restore();
    } else {
      context.fillStyle = ballColors[selectedColor];
      context.beginPath();
      context.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }
  }
  
  canvas.style.backgroundImage = "url('images/background.jpg')";
  canvas.style.backgroundSize = "cover";
  canvas.style.backgroundPosition = "center";
  canvas.style.animation = "backgroundAnimation 10s linear infinite";

  
  

// Initialize the game
init();
