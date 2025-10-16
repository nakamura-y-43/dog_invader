const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const triviaText = document.getElementById('trivia-text');

let playerPosition = 375;
let score = 0;
const playerSpeed = 10;
let gameIsOver = false;
let activeIntervals = [];

const keys = {};
let lastShotTime = 0;
const shootCooldown = 150;

const triviaList = [
    "ミッキーマウスの初代声優はウォルト・ディズニー本人だった。",
    "世界一長い曲は、演奏が終わるまでに639年かかる。",
    "フリスビーを開発した人の遺灰はフリスビーになっている。",
    "ゾウは哺乳類の中で唯一ジャンプができない。",
    "コカ・コーラは元々薬として販売されていた。",
    "アンデスメロンの「アンデス」は「安心です」の略。",
    "鉛筆1本で約56kmの線を書くことができる。",
    "ライターはマッチより先に発明された。",
    "adidasとPUMAの創業者は兄弟である。",
    "海上自衛隊の金曜日のメニューは必ずカレーライス。"
];

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

    document.querySelectorAll('.enemy, .bullet').forEach(el => el.remove());
    activeIntervals.forEach(intervalId => clearInterval(intervalId));
    activeIntervals = [];

    const enemyCreationInterval = setInterval(createEnemy, 2000);
    activeIntervals.push(enemyCreationInterval);

    showRandomTrivia();
    const triviaInterval = setInterval(showRandomTrivia, 5000);
    activeIntervals.push(triviaInterval);

    requestAnimationFrame(gameLoop);
}

// 豆知識を表示
function showRandomTrivia() {
    const randomIndex = Math.floor(Math.random() * triviaList.length);
    triviaText.textContent = `【豆知識】${triviaList[randomIndex]}`;
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

    if (keys['ArrowLeft']) {
        playerPosition -= playerSpeed;
        if (playerPosition < 0) playerPosition = 0;
    }
    if (keys['ArrowRight']) {
        playerPosition += playerSpeed;
        if (playerPosition > 750) playerPosition = 750;
    }
    player.style.left = playerPosition + 'px';

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
    let bulletPositionX = playerPosition + 15;
    let bulletPositionY = 50;

    bullet.style.left = bulletPositionX + 'px';
    bullet.style.bottom = bulletPositionY + 'px';

    gameContainer.appendChild(bullet);

    const bulletInterval = setInterval(() => {
        bulletPositionY += 10;
        bullet.style.bottom = bulletPositionY + 'px';

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

function updateScore(points) {
    if (points === 0) {
        score = 0;
    } else {
        score += points;
    }
    scoreDisplay.textContent = score;
}

function gameOver() {
    gameIsOver = true;
    activeIntervals.forEach(intervalId => clearInterval(intervalId));
    finalScore.textContent = score;
    gameOverScreen.style.display = 'block';
}

restartButton.addEventListener('click', startGame);

startGame();
