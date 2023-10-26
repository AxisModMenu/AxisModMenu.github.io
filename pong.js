// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paddle properties
const paddleWidth = 10;
const paddleHeight = 100;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 5;

// Ball properties
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Score
let playerScore = 0;
let computerScore = 0;

// Other variables
let showWinScreen = false;

// Function to draw a rectangle
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Function to draw the ball
function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

// Function to draw the net
function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

// Function to draw the game
function drawGame() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    if (showWinScreen) {
        ctx.fillStyle = 'white';
        ctx.fillText('Click to play again', canvas.width / 2, canvas.height / 2);
        return;
    }

    drawNet();

    // Left paddle
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, 'white');

    // Right paddle
    drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, 'white');

    // Ball
    drawBall(ballX, ballY, ballSize, 'white');

    // Display scores
    ctx.fillText(playerScore, 100, 100);
    ctx.fillText(computerScore, canvas.width - 100, 100);
}

// Function to move the paddles
function movePaddles() {
    // Move right paddle (computer opponent)
    if (rightPaddleY < ballY - paddleHeight / 2) {
        rightPaddleY += paddleSpeed;
    } else if (rightPaddleY > ballY + paddleHeight / 2) {
        rightPaddleY -= paddleSpeed;
    }

    // Move left paddle (player)
    if (leftPaddleY < 0) {
        leftPaddleY = 0;
    }
    if (leftPaddleY > canvas.height - paddleHeight) {
        leftPaddleY = canvas.height - paddleHeight;
    }
}

// Function to handle ball collisions
function handleCollisions() {
    // Ball hits top or bottom of the canvas
    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball hits left paddle
    if (
        ballX < paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;

        // Adjust the angle based on where the ball hits the paddle
        const deltaY = ballY - (leftPaddleY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.35;
    }

    // Ball hits right paddle
    if (
        ballX > canvas.width - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;

        // Adjust the angle based on where the ball hits the paddle
        const deltaY = ballY - (rightPaddleY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.35;
    }

    if (ballX < 0) {
        computerScore++;
        resetBall();
    }
    if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    if (playerScore >= 5 || computerScore >= 5) {
        showWinScreen = true;
    } else {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 5;
        ballSpeedY = 5;
    }
}

function updateGame() {
    if (showWinScreen) {
        return;
    }

    movePaddles();
    handleCollisions();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

function handleMouse(event) {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    leftPaddleY = mouseY - paddleHeight / 2;
}

canvas.addEventListener('mousemove', handleMouse);
canvas.addEventListener('click', () => {
    if (showWinScreen) {
        playerScore = 0;
        computerScore = 0;
        showWinScreen = false;
    }
});

setInterval(function () {
    updateGame();
    drawGame();
}, 1000 / 60);

function moveRightPaddle() {
    const paddleCenter = rightPaddleY + paddleHeight / 2;
    
    if (paddleCenter < ballY - 35) {
        rightPaddleY += paddleSpeed;
    } else if (paddleCenter > ballY + 35) {
        rightPaddleY -= paddleSpeed;
    }
}
// Function to move the right paddle with predictive AI
function moveRightPaddle() {
    const timeToIntercept = (rightPaddleY + paddleHeight / 2 - ballY) / ballSpeedY;

    const predictedBallX = ballX + ballSpeedX * timeToIntercept;

    const marginOfError = 0;

    const fasterPaddleSpeed = 400; 

    if (predictedBallX > canvas.width / 2 && Math.abs(predictedBallX - (canvas.width - paddleWidth)) > fasterPaddleSpeed) {
        if (predictedBallX > rightPaddleY + paddleHeight * marginOfError) {
            rightPaddleY += fasterPaddleSpeed;
        } else if (predictedBallX < rightPaddleY + paddleHeight * (1 - marginOfError)) {
            rightPaddleY -= fasterPaddleSpeed;
        }
    }
}
