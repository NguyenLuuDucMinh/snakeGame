const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#222',
  scene: {
    create,
    update
  }
};

const game = new Phaser.Game(config);

let snake = [];
let food;
let direction = 'RIGHT';
let nextMove = 0;
const speed = 150;
let score = 0;
let gridSize = 16;

function create() {
  const startX = gridSize * 10;
  const startY = gridSize * 10;

  // Khởi tạo rắn
  for (let i = 0; i < 3; i++) {
    snake.push(this.add.rectangle(startX - i * gridSize, startY, gridSize, gridSize, 0x00ff00));
  }

  // Mồi
  food = this.add.rectangle(randomCoord(this.sys.game.config.width), randomCoord(this.sys.game.config.height), gridSize, gridSize, 0xff0000);

  // Bàn phím
  this.input.keyboard.on('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  });
}

function update(time) {
  if (time < nextMove) return;
  nextMove = time + speed;

  const head = snake[0];
  let newX = head.x;
  let newY = head.y;

  if (direction === 'RIGHT') newX += gridSize;
  else if (direction === 'LEFT') newX -= gridSize;
  else if (direction === 'UP') newY -= gridSize;
  else if (direction === 'DOWN') newY += gridSize;

  // Va chạm tường
  if (
    newX < 0 || newX >= config.width ||
    newY < 0 || newY >= config.height
  ) {
    endGame();
    return;
  }

  // Va chạm thân
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === newX && snake[i].y === newY) {
      endGame();
      return;
    }
  }

  // Di chuyển
  const tail = snake.pop();
  tail.x = newX;
  tail.y = newY;
  snake.unshift(tail);

  // Ăn mồi
  if (Phaser.Math.Distance.Between(newX, newY, food.x, food.y) < 1) {
    const newPart = game.scene.scenes[0].add.rectangle(food.x, food.y, gridSize, gridSize, 0x00ff00);
    snake.push(newPart);
    food.x = randomCoord(config.width);
    food.y = randomCoord(config.height);

    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
  }
}

function randomCoord(max) {
  return Phaser.Math.Snap.Floor(Phaser.Math.Between(0, max), gridSize);
}

function endGame() {
  document.getElementById('gameOver').style.display = 'block';
  game.scene.pause();
}
