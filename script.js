let board = document.querySelector('.board');
let modal = document.querySelector('.modal');
let domScore = document.querySelector('#score');
let domHighScore = document.querySelector('#high-score');
let domTime = document.querySelector('#time');
let btnStart = document.querySelector('.btn-start');
let startAgain = document.querySelector('.start-again');
let gameOverModal = document.querySelector('.game-over-modal');
let btnHighScore = document.querySelectorAll('.btn-high-score');
let btnSnakeSpeed = document.querySelectorAll('.btn-snake-speed');
let themeStyle = document.querySelector('#theme-style');
let btnTheme = document.querySelector('.btn-theme');
let foodSound = new Audio('foodSound.mp3');
let gameOver = new Audio('gameOver.mp3');
let gameStart = new Audio('gameStart.mp3');
let btnUp = document.querySelector('.up');
let btnDown = document.querySelector('.down');
let btnLeft = document.querySelector('.left');
let btnRight = document.querySelector('.right');
let theme = "Retro";
const isMobile = window.matchMedia("(max-width: 768px)");

let Score = 0;
let mode = 0;
let modeScore = 0;
let timerSeconds = 0;
let timerInterval;
let block_index = {};
let direction = 'left';
let intervalId;
let snakeSpeed = 300;
let blockHeight;
let blockWidth;

if (isMobile.matches) {
    blockHeight = 30;
    blockWidth = 30;
} else {
    blockHeight = 50;
    blockWidth = 50;
}
const cols = Math.max(6, Math.floor(board.clientWidth / blockWidth));
const rows = Math.max(6, Math.floor(board.clientHeight / blockHeight));
let highScore = parseInt(localStorage.getItem('highScore'), 10) || 0;
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
const _startY = Math.min(cols - 3, Math.max(2, Math.floor(cols / 2)));
const snake = [{ x: 1, y: _startY }, { x: 1, y: _startY + 1 }, { x: 1, y: _startY + 2 }];

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        block_index[`${row}-${col}`] = block;
    }
}

function updateScoreDOM() {
    domScore.textContent = Score;
    domHighScore.textContent = highScore;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

function updateTimeDOM() {
    domTime.textContent = formatTime(timerSeconds);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerSeconds = 0;
    updateTimeDOM();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds += 1;
        updateTimeDOM();
    }, 1000);
}

updateScoreDOM();
updateTimeDOM();

function render() {
    let head = [];
    block_index[`${food.x}-${food.y}`].classList.remove('food');
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }
    else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        clearInterval(timerInterval);
        gameOverModal.classList.remove('game-over-hidden');
        gameOver.play();
        return;
    }
    snake.forEach((segment) => {
        block_index[`${segment.x}-${segment.y}`].classList.remove('snake-segment');
    })
    snake.unshift(head);
    if (head.x == food.x && head.y == food.y) {
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        Score += 1;
        foodSound.play();
        if (Score > highScore) {
            highScore = Score;
            localStorage.setItem('highScore', highScore);
        }
        updateScoreDOM();
    } else {
        snake.pop();
    }
    block_index[`${food.x}-${food.y}`].classList.add('food');
    snake.forEach((segment) => {
        block_index[`${segment.x}-${segment.y}`].classList.add('snake-segment');
    })
}

btnStart.addEventListener('click', () => {
    modal.classList.add('modal-hidden');
    gameStart.play();
    Score = 0;
    resetTimer();
    startTimer();
    updateScoreDOM();
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        render();
    }, snakeSpeed);
})

startAgain.addEventListener('click', () => {
    gameOverModal.classList.add('game-over-hidden');
    gameStart.play();
    snake.length = 0;
    snake.push({ x: 1, y: _startY }, { x: 1, y: _startY + 1 }, { x: 1, y: _startY + 2 });
    direction = 'left';
    Score = 0;
    resetTimer();
    startTimer();
    updateScoreDOM();
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    Object.values(block_index).forEach((block) => {
        block.classList.remove('snake-segment', 'food');
    });
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        render();
    }, snakeSpeed);
})

addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp") {
        direction = "up";
    }
    else if (event.key === "ArrowDown") {
        direction = "down";
    }
    else if (event.key === "ArrowLeft") {
        direction = "left";
    }
    else if (event.key === "ArrowRight") {
        direction = "right";
    }
})

btnUp.addEventListener('click', () => {
    direction = "up";
})
btnDown.addEventListener('click', () => {
    direction = "down";
})
btnLeft.addEventListener('click', () => {
    direction = "left";
})
btnRight.addEventListener('click', () => {
    direction = "right";
})



btnSnakeSpeed.forEach((btn) => {
    btn.addEventListener('click', () => {
        mode++;
        if (mode > 2) {
            mode = 0;
        }
        if (mode === 0) {
            btn.innerHTML = "Speed: Slow";
            snakeSpeed = 700;
        }
        else if (mode === 1) {
            btn.innerHTML = "Speed: Medium";
            snakeSpeed = 300;
        }
        else if (mode === 2) {
            btn.innerHTML = "Speed: High";
            snakeSpeed = 100;
        }
        clearInterval(intervalId);
    });
});

btnHighScore.forEach((btn) => {

    btn.addEventListener('click', () => {
        modeScore++
        if (modeScore > 1) {
            modeScore = 0;
        }
        if (modeScore === 0) {
            btn.innerHTML = "See High Score";
        }
        else if (modeScore === 1) {
            btn.innerHTML = `High Score ${highScore}`;
        }
    })
})

btnTheme.addEventListener('click', () => {
    if (theme === "Retro") {
        btnTheme.innerHTML = "Theme: Cyberpunk";
        themeStyle.href = "style_2.css";
        theme = "Cyberpunk";
    }
    else if (theme === "Cyberpunk") {
        btnTheme.innerHTML = "Theme: Retro";
        themeStyle.href = "style.css";
        theme = "Retro";
    }
})
