const width = 800;
const height = 600;
const groundY = 542;
const playerX = 110;

let player;
let obstacles = [];
let score = 0;
let gameSpeed = 5;
let obstacleTimer = 0;
let state = 'start';

function setup() {
    createCanvas(width, height);
    resetGame();
}

function draw() {
    drawBackground();

    if (state === 'start') {
        drawMessage('GHOST RUNNER', 'Press UP to start and jump');
        return;
    }

    if (state === 'over') {
        drawMessage('GAME OVER', 'Score: ' + score + '   |   Press UP to try again');
        return;
    }

    updateGame();
    drawGround();
    drawObstacles();
    drawGhost(playerX, player.y);
    drawHud();
}

function drawBackground() {
    background(15, 10, 25);

    noStroke();
    fill(255, 240, 200);
    ellipse(690, 85, 58, 58);
    fill(15, 10, 25);
    ellipse(710, 72, 54, 54);

    drawDistantGraves();
}

function drawDistantGraves() {
    noStroke();
    fill(35, 29, 47);

    drawGravestone(40, 510, 48, 88);
    drawGravestone(175, 518, 58, 80);
    drawGravestone(310, 505, 46, 93);
    drawGravestone(475, 515, 62, 83);
    drawGravestone(635, 508, 52, 90);
    drawGravestone(755, 517, 48, 81);

    fill(24, 21, 33);
    rect(0, 528, width, 72);
}

function drawGravestone(x, baseY, stoneWidth, stoneHeight) {
    rect(x, baseY - stoneHeight + stoneWidth / 2, stoneWidth, stoneHeight - stoneWidth / 2);
    arc(x + stoneWidth / 2, baseY - stoneHeight + stoneWidth / 2,
        stoneWidth, stoneWidth, PI, TWO_PI);
    stroke(58, 49, 69);
    strokeWeight(2);
    line(x + stoneWidth / 2, baseY - stoneHeight + 20,
        x + stoneWidth / 2, baseY - stoneHeight + 42);
    line(x + stoneWidth / 2 - 8, baseY - stoneHeight + 28,
        x + stoneWidth / 2 + 8, baseY - stoneHeight + 28);
    noStroke();
}

function drawGround() {
    noStroke();
    fill(40, 30, 50);
    rect(0, groundY, width, height - groundY);
    fill(75, 61, 77);
    rect(0, groundY, width, 4);
}

function updateGame() {
    player.velocityY += 0.8;
    player.y += player.velocityY;
    if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }

    gameSpeed = min(11, 5 + floor(score / 250));
    obstacleTimer--;
    if (obstacleTimer <= 0) {
        obstacles.push({
            x: width + 20,
            width: random(30, 46),
            height: random(42, 66)
        });
        obstacleTimer = floor(random(85, 130) / (gameSpeed / 5));
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= gameSpeed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
        } else if (hitsObstacle(obstacle)) {
            state = 'over';
        }
    }
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        drawGravestone(obstacle.x, groundY, obstacle.width, obstacle.height);
    }
}

function drawGhost(x, y) {
    noStroke();
    fill(152, 255, 152);
    ellipse(x, y + 20, 42, 42);
    rect(x - 21, y + 20, 42, 22);
    triangle(x - 21, y + 40, x - 10, y + 50, x, y + 40);
    triangle(x - 1, y + 40, x + 10, y + 50, x + 21, y + 40);
    fill(20);
    ellipse(x - 9, y + 17, 5, 8);
    ellipse(x + 9, y + 17, 5, 8);
}

function hitsObstacle(obstacle) {
    const playerLeft = playerX - 15;
    const playerRight = playerX + 15;
    const playerBottom = player.y + player.height;
    const obstacleTop = groundY - obstacle.height;
    return playerRight > obstacle.x &&
        playerLeft < obstacle.x + obstacle.width &&
        playerBottom > obstacleTop;
}

function drawHud() {
    textAlign(LEFT, TOP);
    fill(255);
    textSize(18);
    text('Score: ' + score, 16, 14);
    textAlign(RIGHT, TOP);
    text('UP to jump', width - 16, 14);
}

function drawMessage(title, subtitle) {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(34);
    text(title, width / 2, height / 2 - 24);
    textSize(18);
    text(subtitle, width / 2, height / 2 + 20);
}

function resetGame() {
    player = {
        y: groundY - 50,
        height: 50,
        velocityY: 0,
        isJumping: false
    };
    obstacles = [];
    score = 0;
    gameSpeed = 5;
    obstacleTimer = 60;
}

function jump() {
    if (state === 'start' || state === 'over') {
        resetGame();
        state = 'play';
    }

    if (!player.isJumping) {
        player.velocityY = -15;
        player.isJumping = true;
    }
}

function keyPressed() {
    if (keyCode === UP_ARROW || key === ' ') {
        jump();
        return false;
    }
}

function mousePressed() {
    if (state !== 'play') {
        jump();
    }
}
