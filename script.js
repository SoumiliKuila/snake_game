const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;

let direction;
let nextDirection;

let score = 0;
let bestScore = localStorage.getItem("snakeBest") || 0;

let gameRunning = false;
let gameLoop;

document.getElementById("best").innerText = bestScore;

function startGame() {

    clearInterval(gameLoop);

    snake = [
        { x: 180, y: 180 },
        { x: 160, y: 180 },
        { x: 140, y: 180 }
    ];

    direction = "right";
    nextDirection = "right";

    score = 0;

    document.getElementById("score").innerText = score;

    document.getElementById("message").innerText = "Game Running...";

    document.getElementById("startBtn").innerText = "Restart Game";

    gameRunning = true;

    createFood();

    gameLoop = setInterval(updateGame, 120);
}

function createFood() {

    food = {
        x: Math.floor(Math.random() * 18) * box,
        y: Math.floor(Math.random() * 18) * box
    };

    for (let part of snake) {

        if (part.x === food.x && part.y === food.y) {
            createFood();
            return;
        }
    }
}

function updateGame() {

    if (!gameRunning) {
        return;
    }

    direction = nextDirection;

    let head = {
        x: snake[0].x,
        y: snake[0].y
    };

    if (direction === "up") {
        head.y -= box;
    }

    if (direction === "down") {
        head.y += box;
    }

    if (direction === "left") {
        head.x -= box;
    }

    if (direction === "right") {
        head.x += box;
    }

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {
        gameOver();
        return;
    }

    // Self collision
    for (let part of snake) {

        if (
            head.x === part.x &&
            head.y === part.y
        ) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Food collision
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score++;

        document.getElementById("score").innerText = score;

        if (score > bestScore) {

            bestScore = score;

            localStorage.setItem(
                "snakeBest",
                bestScore
            );

            document.getElementById("best").innerText =
                bestScore;
        }

        createFood();

    } else {

        snake.pop();

    }

    drawGame();
}

function drawGame() {

    ctx.fillStyle = "#1f2937";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Grid
    ctx.strokeStyle = "#374151";

    for (let x = 0; x < canvas.width; x += box) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += box) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#ef4444";

    ctx.fillRect(
        food.x,
        food.y,
        box,
        box
    );

    // Snake
    snake.forEach((part, index) => {

        ctx.fillStyle =
            index === 0 ? "#22c55e" : "#86efac";

        ctx.fillRect(
            part.x,
            part.y,
            box,
            box
        );

        ctx.strokeStyle = "#111827";

        ctx.strokeRect(
            part.x,
            part.y,
            box,
            box
        );
    });
}

function changeDirection(newDirection) {

    if (!gameRunning) {
        return;
    }

    if (
        newDirection === "up" &&
        direction !== "down"
    ) {
        nextDirection = "up";
    }

    if (
        newDirection === "down" &&
        direction !== "up"
    ) {
        nextDirection = "down";
    }

    if (
        newDirection === "left" &&
        direction !== "right"
    ) {
        nextDirection = "left";
    }

    if (
        newDirection === "right" &&
        direction !== "left"
    ) {
        nextDirection = "right";
    }
}

function gameOver() {

    gameRunning = false;

    clearInterval(gameLoop);

    document.getElementById("message").innerText =
        "💥 Game Over! Score: " + score;
}

document.addEventListener("keydown", function(event) {

    if (
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {
        changeDirection("up");
    }

    if (
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {
        changeDirection("down");
    }

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {
        changeDirection("left");
    }

    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {
        changeDirection("right");
    }
});