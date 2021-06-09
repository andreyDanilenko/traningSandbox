document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  ///Array.from(squares); //преобразуем в массив массивоподобный
  const scoreDisplay = document.querySelector('#tetris-score');
  const startBtn = document.querySelector('#tetris-start-button');
  const width = 10;
  let nextRandom = 0;
  let timeId;
  let score = 0;

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];
  // Функция вырисовывающая фигуру 
  // Закрашиваем квадраты массива "squares" перебором случайного масива вмассиве theTetraminoes
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
    });
  };
  // Функция стирающая фигуру 
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    });
  };
  // функция работы клавиш
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft() // стрелка влево запускающая функцию moveLeft
    } else if (e.keyCode === 38) {
      rotate() // стрелка вверх разворачивает элемент
    } else if (e.keyCode === 39) {
      moveRight() // стрелка вправо запускающая функцию moveRight
    } else if (e.keyCode === 40) {
      moveDown()
    }
  };
  document.addEventListener('keyup', control);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  };
  // функция останавливающая фигуру в конце контейнера
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }
  //функции отрисовывающая фигуру в зависимости ее положения влево
  //стирает старую фигуру, меняет положение в зависимсти от стороны, отрисовывает фигуру
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw();
  };
  //функции отрисовывающая фигуру в зависимости ее положения вправо
  function moveRight() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtLeftEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw();
  };
  // функция отрисовывающая разварот фигуры вокруг своей оси

  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition()
    draw();
  };
  //Исправляем срез при вращении с краю
  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0)
  };

  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
  };

  function checkRotatedPosition(P) {
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()) {            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
      }
    }
    else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1
        checkRotatedPosition(P)
      }
    }
  };

  const displaySquares = document.querySelectorAll('.mini-grid div');

  const displayWidth = 5;
  let displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //z
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // t
    [0, 1, displayWidth, displayWidth + 1], // o
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // i
  ];

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    });
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
    });
  };

  //Добавляем работоспособность кнопке start/pause
  startBtn.addEventListener('click', () => {
    if (timeId) {
      clearInterval(timeId)
      timeId = null;
    } else {
      draw();
      timeId = setInterval(moveDown, 500);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });
  // функция сигнализирующая о сплошной линии образованную фигурами
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
      // console.log(row)
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  };

  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timeId)
    }
  }
});