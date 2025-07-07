// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const gridSize = 20;
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const pathAudio = 'audio/';

// Define game variables
let snake = [{x: 10, y:10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let currentAudio = null; // To keep track of the currently playing audio
let sfxMusicController = 0;

// Draw the game map, snake and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw the snake on the game board
function drawSnake() {
    snake.forEach((segment)=> {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

// Create a snake or game cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of the snake or game cube/div
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}   

// Draw the food on the game board
function drawFood() {
    if (gameStarted){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }    
}

// Generate food
function generateFood (){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Moving the snake
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        playSFX('rhodes-');
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // Clear past interval
        gameInterval = setInterval(() => {
            moveSnake();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

async function playMusic(audioFile) {
    if (currentAudio) {
        currentAudio.pause(); // Pause any currently playing audio
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(`${pathAudio}${audioFile}.mp3`);
    currentAudio.volume = 0.3;
    currentAudio.play().catch(error => {
        console.error("Error playing audio:", error);
    });
}

async function playSFX(audioFile){
    if (sfxMusicController < 15 ){
        sfxMusicController++;
    } else {
        sfxMusicController = 1;
    }
    let sfxMusicControllerFormatted = sfxMusicController.toString().padStart(2, '0');
    let sFX = new Audio(`${pathAudio}${audioFile}${sfxMusicControllerFormatted}.mp3`);
    sFX.play().catch(error => {
        console.error("Error playing audio:", error);
    });
}

function stopCurrentMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null; // Clear the reference
    }
}

// Start game function
function startGame() {
    playMusic('theSnakeGame');
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Key press event listener
function handleKeyPress(event) {
    if ( 
         (!gameStarted && event.code === 'Space') || 
         (!gameStarted && event.key === ' ') 
        ){
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                direction = 'up';
                break;
            case 'ArrowDown':
                event.preventDefault();
                direction = 'down';
                break;
            case 'ArrowLeft':
                event.preventDefault();
                direction = 'left';
                break;
            case 'ArrowRight':
                event.preventDefault();
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];
    if (
        head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize
    ) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    stopCurrentMusic();
    sfxMusicController = 0;
    updateHighScore();
    stopGame();
    clearInterval(gameInterval);
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';    
    gameSpeedDelay = 200;
    updateScore();
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateScore() {
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length -1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

// Test moving
// setInterval(() => {
//     moveSnake();
//     draw();
// }, 200);