const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let playerPosition = 375;
let score = 0;
const playerSpeed = 10; // スピードを少し調整
let gameIsOver = false;
let activeIntervals = [];

const keys = {};
let lastShotTime = 0;
const shootCooldown = 150; // 150msごとに発射可能

// ゲーム開始処理
function startGame() {
    gameIsOver = false;
    score = 0;
    updateScore(0);
    playerPosition = 375;
    player.style.left = playerPosition + 'px';
    gameOverScreen.style.display = 'none';
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
    keys['Space'] = false;

    // 既存の敵と弾を削除
    document.querySelectorAll('.enemy, .bullet').forEach(el => el.remove());

    // インターバルをクリア
    activeIntervals.forEach(intervalId => clearInterval(intervalId));
    activeIntervals = [];

    // 敵の生成を開始
    const enemyCreationInterval = setInterval(createEnemy, 2000);
    activeIntervals.push(enemyCreationInterval);

    // ゲームループを開始
    requestAnimationFrame(gameLoop);
}

// キーの押下状態を記録
document.addEventListener('keydown', (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.code in keys) {
        keys[e.code] = false;
    }
});

// ゲームループ
function gameLoop() {
    if (gameIsOver) return;

    // プレイヤーの移動
    if (keys['ArrowLeft']) {
        playerPosition -= playerSpeed;
        if (playerPosition < 0) playerPosition = 0;
    }
    if (keys['ArrowRight']) {
        playerPosition += playerSpeed;
        if (playerPosition > 750) playerPosition = 750;
    }
    player.style.left = playerPosition + 'px';

    // 弾の発射
    if (keys['Space']) {
        const now = Date.now();
        if (now - lastShotTime > shootCooldown) {
            createBullet();
            lastShotTime = now;
        }
    }

    requestAnimationFrame(gameLoop);
}

function createBullet() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.innerHTML = '🦴';
    let bulletPositionX = playerPosition + 15; // プレイヤーの中央から
    let bulletPositionY = 50; // プレイヤーの少し上から

    bullet.style.left = bulletPositionX + 'px';
    bullet.style.bottom = bulletPositionY + 'px';

    gameContainer.appendChild(bullet);

    const bulletInterval = setInterval(() => {
        bulletPositionY += 10;
        bullet.style.bottom = bulletPositionY + 'px';

        // 弾と敵の衝突判定
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();

            if (bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top) {
                enemy.remove();
                bullet.remove();
                clearInterval(bulletInterval);
                updateScore(10);
            }
        });

        if (bulletPositionY > 600) {
            bullet.remove();
            clearInterval(bulletInterval);
        }
    }, 20);
    activeIntervals.push(bulletInterval);
}

// 敵の生成
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.innerHTML = '👽';
    let enemyPositionX = Math.floor(Math.random() * 760);
    let enemyPositionY = 0;

    enemy.style.left = enemyPositionX + 'px';
    enemy.style.top = enemyPositionY + 'px';

    gameContainer.appendChild(enemy);

    const enemyInterval = setInterval(() => {
        if (gameIsOver) {
            clearInterval(enemyInterval);
            return;
        }
        enemyPositionY += 3;
        enemy.style.top = enemyPositionY + 'px';

        // 敵とプレイヤーの衝突判定
        const playerRect = player.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        if (!gameIsOver &&
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top) {
            gameOver();
        }

        if (enemyPositionY > 600) {
            enemy.remove();
            clearInterval(enemyInterval);
        }
    }, 50);
    activeIntervals.push(enemyInterval);
}

// スコア更新
function updateScore(points) {
    if (points === 0) {
        score = 0;
    } else {
        score += points;
    }
    scoreDisplay.textContent = score;
}

// ゲームオーバー処理
function gameOver() {
    gameIsOver = true;
    activeIntervals.forEach(intervalId => clearInterval(intervalId));
    finalScore.textContent = score;
    gameOverScreen.style.display = 'block';
}

// リスタートボタンのイベント
restartButton.addEventListener('click', startGame);

// ゲーム開始
startGame();
