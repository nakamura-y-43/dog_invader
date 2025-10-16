const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

let playerPosition = 375;
let score = 0;
const playerSpeed = 15;

// プレイヤーの移動
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        playerPosition -= playerSpeed;
        if (playerPosition < 0) {
            playerPosition = 0;
        }
    } else if (e.key === 'ArrowRight') {
        playerPosition += playerSpeed;
        if (playerPosition > 750) { // gameContainer.width - player.width
            playerPosition = 750;
        }
    }
    player.style.left = playerPosition + 'px';
});

// 弾の発射
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        createBullet();
    }
});

function createBullet() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.innerHTML = '🦴';
    let bulletPositionX = playerPosition + 15; // プレイヤーの中央から
    let bulletPositionY = 550; // プレイヤーの少し上から

    bullet.style.left = bulletPositionX + 'px';
    bullet.style.bottom = bulletPositionY + 'px';

    gameContainer.appendChild(bullet);

    const bulletInterval = setInterval(() => {
        bulletPositionY += 10;
        bullet.style.bottom = bulletPositionY + 'px';

        // 衝突判定
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            const bulletRect = bullet.getBoundingClientRect();

            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
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
        enemyPositionY += 3;
        enemy.style.top = enemyPositionY + 'px';

        if (enemyPositionY > 600) {
            enemy.remove();
            clearInterval(enemyInterval);
        }
    }, 50);
}

// スコア更新
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
}

// 敵を定期的に生成
setInterval(createEnemy, 2000);
