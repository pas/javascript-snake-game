'use strict';

var gameStart = {},
  gameSpeed = {},
  gameArea = {},
  manualStep = {},
  gameAreaContext = {},
  snake = [],
  gameAreaWidth = 0,
  gameAreaHeight = 0,
  cellWidth = 0,
  playerScore = 0,
  snakeFood = {},
  snakeDirection = '',
  speedSize = 0,
  timer = {};

function initElement() {
  gameStart = document.querySelector('#gameStart');
  gameSpeed = document.querySelector('#gameSpeed');
  gameArea = document.querySelector('#gameArea');
  manualStep = document.querySelector('#manualStep');

  gameAreaContext = gameArea.getContext('2d');
  gameAreaWidth = 400;
  gameAreaHeight = 600;
  cellWidth = 20;
  gameArea.width = gameAreaWidth;
  gameArea.height = gameAreaHeight;
}

// Create game area
function createGameArea() {
  gameAreaContext.fillStyle = '#FFFFFF';
  gameAreaContext.fillRect(0, 0, gameAreaWidth, gameAreaHeight);
  gameAreaContext.strokeStyle = '#000000';
  gameAreaContext.strokeRect(0, 0, gameAreaWidth, gameAreaHeight);
}

// https://stackoverflow.com/a/58325961
function generateHexString(len) {
    let output = '';
    for (let i = 0; i < len; ++i) {
        output += (Math.floor(Math.random() * 16)).toString(16);
    }
    return output;
}

// Create food
function createFood() {
  snakeFood = {
    x: Math.round(Math.random() * (gameAreaWidth - cellWidth) / cellWidth),
    y: Math.round(Math.random() * (gameAreaHeight - cellWidth) / cellWidth),
    color: '#' + generateHexString(6)
  };
}

// Check if the snake is onitself
function snakeOnItself(x, y, array) {
  for (var index = 0, length = array.length; index < length; index++) {
    if (array[index].x == x && array[index].y == y) return true;
  }
  return false;
}

function writeScore() {
  gameAreaContext.font = '50px sans-serif';
  gameAreaContext.fillStyle = '#FF0000';
  gameAreaContext.fillText('Punkte: ' + playerScore, (gameAreaWidth / 2) - 100, gameAreaHeight / 2);
}

function createSquare(x, y) {
  createColoredSquare(x, y, '#000000')
}

function createColoredSquare(x, y, color) {
  gameAreaContext.fillStyle = color;
  gameAreaContext.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}

function checkDirectionUpdatePosition() {
  var snakeX = snake[0].x;
  var snakeY = snake[0].y;
  if (snakeDirection == 'right') {
    snakeX++;
  } else if (snakeDirection == 'left') {
    snakeX--;
  } else if (snakeDirection == 'down') {
    snakeY++;
  } else if (snakeDirection == 'up') {
    snakeY--;
  }
  return { snakeX, snakeY };
}

function didSnakeEatTheFood(snakeX, snakeY) {
  if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
    return true;
  } else {
    return false;
  }
}

function updateGameArea() {

  var snakeAteFoodVar = false;
  var isSnakeOnItself = false

  createGameArea();

  var newPosition = checkDirectionUpdatePosition();
  var snakeX = newPosition.snakeX;
  var snakeY = newPosition.snakeY;


  // make snake hit itself
  var isSnakeOnItself = snakeOnItself(snakeX, snakeY, snake)
  if(isSnakeOnItself) {
    writeScore();
    clearInterval(timer);
    gameStart.disabled = false;
    return
  }


  // make snake hit the wall
  if(checkSnakeOutOfBounds(snakeX, snakeY, isSnakeOnItself)) {
    writeScore();
    clearInterval(timer);
    gameStart.disabled = false;
    return
  }


  // make snake eat the food
  snakeAteFoodVar = didSnakeEatTheFood(snakeX, snakeY);
  if (snakeAteFoodVar) {
    var newHead = {
      x: snakeX,
      y: snakeY,
      color: snakeFood.color }
    playerScore += speedSize;

    if(snake.length+1 % 4 == 0) {
      speedSize += 1
      restartTimer()
    }

    createFood();
  }

  // make snake move
  if(!snakeAteFoodVar) {
    var newHead = snake.pop();
    newHead.x = snakeX;
    newHead.y = snakeY;
  }
  snake.unshift(newHead);

  // create the snake
  for (var index = 0, length = snake.length; index < length; index++) {
    createColoredSquare(snake[index].x, snake[index].y, snake[index].color);
  }

  // create the food
  createColoredSquare(snakeFood.x, snakeFood.y, snakeFood.color);
}

function checkSnakeOutOfBounds(snakeX, snakeY) {
  if ((snakeX == -1) ||
    (snakeX == gameAreaWidth / cellWidth) ||
    (snakeY == -1) ||
    (snakeY == gameAreaHeight / cellWidth)) {
      return true;
  }
  return false;
}

function restartTimer() {
  // make the snake move automatically
  clearInterval(timer);
  timer = setInterval(updateGameArea, 500 / speedSize);
}

function startGame() {

  // initally create snake
  snake = [];
  snake.push({ x: 0, y: cellWidth, color: '#' + generateHexString(6) });

  // create the food
  createFood();

  restartTimer()
}

function stepOnClick() {
  updateGameArea();
}

function onStartGame() {
  this.disabled = true;

  // reset score
  playerScore = 0;

  // reset direction to right
  snakeDirection = 'right';

  // reset speed the set value
  speedSize = parseInt(gameSpeed.value);
  if (speedSize > 9) {
    speedSize = 9;
  } else if (speedSize < 0) {
    speedSize = 1;
  }

  startGame();
}

function changeDirection(e) {
  var keys = e.which;
  if (keys == '40' && snakeDirection != 'up') snakeDirection = 'down';
  else if (keys == '39' && snakeDirection != 'left') snakeDirection = 'right';
  else if (keys == '38' && snakeDirection != 'down') snakeDirection = 'up';
  else if (keys == '37' && snakeDirection != 'right') snakeDirection = 'left';
}



function initEvent() {
  gameStart.addEventListener('click', onStartGame);
  manualStep.addEventListener('click', stepOnClick)
  window.addEventListener('keydown', changeDirection);
}

function init() {
  initElement();
  createGameArea()
  initEvent();
}

window.addEventListener('DOMContentLoaded', init);
