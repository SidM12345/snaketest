document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const restartButton = document.getElementById('restartButton');
    const finalScore = document.getElementById('finalScore');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let dx = 0;
    let dy = 0;
    let foodX, foodY;
    let score = 0;
    let gameLoop;

    function startGame() {
        startScreen.style.display = 'none';
        resetGame();
        spawnFood();
        gameLoop = setInterval(updateGame, 100);
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 0;
        dy = 0;
        score = 0;
    }

    function spawnFood() {
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
    }

    function updateGame() {
        moveSnake();
        if (checkCollision()) {
            endGame();
            return;
        }
        checkFoodCollision();
        draw();
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x !== foodX || head.y !== foodY) {
            snake.pop();
        } else {
            score++;
            spawnFood();
        }
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 0 || head.x >= tileCount ||
            head.y < 0 || head.y >= tileCount ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function checkFoodCollision() {
        if (snake[0].x === foodX && snake[0].y === foodY) {
            score++;
            spawnFood();
        }
    }

    function draw() {
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#2ecc71';
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Draw head
                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw eyes
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize / 2 + dx * 3, segment.y * gridSize + gridSize / 2 + dy * 3, 3, 0, 2 * Math.PI);
                ctx.arc(segment.x * gridSize + gridSize / 2 + dx * 3 - dy * 5, segment.y * gridSize + gridSize / 2 + dy * 3 + dx * 5, 3, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize / 2 + dx * 4, segment.y * gridSize + gridSize / 2 + dy * 4, 1.5, 0, 2 * Math.PI);
                ctx.arc(segment.x * gridSize + gridSize / 2 + dx * 4 - dy * 5, segment.y * gridSize + gridSize / 2 + dy * 4 + dx * 5, 1.5, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                // Draw body
                ctx.fillStyle = index % 2 === 0 ? '#2ecc71' : '#27ae60';
                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2, gridSize / 2 - 1, 0, 2 * Math.PI);
                ctx.fill();
            }
        });

        // Draw food (apple)
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(foodX * gridSize + gridSize / 2, foodY * gridSize + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw stem
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(foodX * gridSize + gridSize / 2 - 1, foodY * gridSize, 2, 7);

        // Draw score
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function endGame() {
        clearInterval(gameLoop);
        finalScore.textContent = `Your score: ${score}`;
        gameOverScreen.style.display = 'flex';
    }

    function handleKeyPress(e) {
        const key = e.key;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if (key === 'ArrowUp' && !goingDown) {
            dx = 0;
            dy = -1;
        }
        if (key === 'ArrowDown' && !goingUp) {
            dx = 0;
            dy = 1;
        }
        if (key === 'ArrowLeft' && !goingRight) {
            dx = -1;
            dy = 0;
        }
        if (key === 'ArrowRight' && !goingLeft) {
            dx = 1;
            dy = 0;
        }
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        startGame();
    });
    document.addEventListener('keydown', handleKeyPress);
});