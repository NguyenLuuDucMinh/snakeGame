const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    backgroundColor: '#1d1d1d',
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
  
  function create() {
    // Khởi tạo rắn
    snake.push(this.add.rectangle(160, 160, 16, 16, 0x00ff00));
    snake.push(this.add.rectangle(144, 160, 16, 16, 0x00ff00));
    snake.push(this.add.rectangle(128, 160, 16, 16, 0x00ff00));
  
    // Tạo mồi
    food = this.add.rectangle(randomCoord(), randomCoord(), 16, 16, 0xff0000);
  
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
  
    // Lấy vị trí đầu rắn
    const head = snake[0];
    let newX = head.x;
    let newY = head.y;
  
    if (direction === 'RIGHT') newX += 16;
    else if (direction === 'LEFT') newX -= 16;
    else if (direction === 'UP') newY -= 16;
    else if (direction === 'DOWN') newY += 16;
  
    // Game over nếu đụng tường
    if (newX < 0 || newX >= 400 || newY < 0 || newY >= 400) {
      location.reload();
      return;
    }
  
    // Game over nếu đụng chính mình
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === newX && snake[i].y === newY) {
        location.reload();
        return;
      }
    }
  
    // Di chuyển: lấy đuôi → đặt đầu mới
    const tail = snake.pop();
    tail.x = newX;
    tail.y = newY;
    snake.unshift(tail);
  
    // Ăn mồi
    if (Phaser.Math.Distance.Between(newX, newY, food.x, food.y) < 1) {
      const newPart = game.scene.scenes[0].add.rectangle(food.x, food.y, 16, 16, 0x00ff00);
      snake.push(newPart);
      food.x = randomCoord();
      food.y = randomCoord();
    }
  }
  
  function randomCoord() {
    return Phaser.Math.Between(0, 24) * 16;
  }
  