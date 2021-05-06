const mainDiv = document.getElementById("app");
const solvedDiv = document.getElementById("solved");
const genButton = document.querySelector('button');

// Solve Sudoku

const findZero = (sudoku) => {
  for (let y = 0; y < sudoku.length; y++) {
    for (let x = 0; x < sudoku[y].length; x++) {
      if (sudoku[y][x] === 0) {
        return [y, x];
      }
    }
  }
  return [-1, -1];
}

const rowOrColOrBlkIncludes = (sudoku, row, col, value) => {
  // Does the row already include the testing value?
  if (!sudoku[row].includes(value)) {
    let colArr = [];
    for (let y = 0; y < sudoku.length; y++) {
      colArr.push(sudoku[y][col])
    }
      // Does the column already include testing value?
      if (!colArr.includes(value)) {
        const blkStartX = Math.floor(col / 3) * 3;
        const blkStartY = Math.floor(row / 3) * 3;
        // Does the block already include the testing value?
        const blockArr = []
        for (let y = blkStartY; y < blkStartY + 3; y++) {
          for (let x = blkStartX; x < blkStartX + 3; x++) {
            blockArr.push(sudoku[y][x]);
          }
        }
        if (blockArr.includes(value)) {
          return false;
        }
        return true;
      }
      return false;
  }
  return false;
}

const solveSudoku = (unsolvedSudoku) => {
  let zeroPos = findZero(unsolvedSudoku);
  let row = zeroPos[0];
  let col = zeroPos[1];

  // returns solved sudoku
  if (row === -1) {
    return unsolvedSudoku;
  }

  for (let value = 1; value < 10; value++) {
    if (rowOrColOrBlkIncludes(unsolvedSudoku, row, col, value)) {
      unsolvedSudoku[row][col] = value;
      solveSudoku(unsolvedSudoku);
    } 
  }

  if (findZero(unsolvedSudoku)[0] !== -1) {
    unsolvedSudoku[row][col] = 0;
  }

  return false;
}

// Creating the sudoku

const generateRandomSudoku = (givenNumbers) => {
  let userSudoku = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  //How many numbers have been entered?

  let placedNumbers = 0;

  // Generate numbers in the userSudoku

  while (placedNumbers < givenNumbers) {
    const xcoord = Math.floor(Math.random() * (8 - 0 + 1) + 0);
    const ycoord = Math.floor(Math.random() * (8 - 0 + 1) + 0);
    const randomNumber = Math.floor(Math.random() * (9 - 1 + 1) + 1);

    // Check if a number assigned already
    if (userSudoku[ycoord][xcoord] === 0) {
      // Check if the row already includes randomNumber
      if (!userSudoku[ycoord].includes(randomNumber)) {
        // Create an array of numbers in the xcoord column
        let columnArray = [];
        for (let i = 0; i < userSudoku.length; i++) {
          columnArray.push(userSudoku[i][xcoord]);
        }
        // Check if the specified column includes the randomnumber
        if (!columnArray.includes(randomNumber)) {
          // Calculate the block coordinates
          const blkStartX = Math.floor(xcoord / 3) * 3;
          const blkStartY = Math.floor(ycoord / 3) * 3;
          let blockArr = [];
          // Iterate through the block and push all 
          for (let x = blkStartX; x < blkStartX + 3; x++) {
            for (let y = blkStartY; y < blkStartY + 3; y++) {
              blockArr.push(userSudoku[y][x])
            }
          }
          if (!blockArr.includes(randomNumber)) {
            userSudoku[ycoord][xcoord] = randomNumber;
            placedNumbers++;
          }
        }
      }
    }
  }
  sudoku = JSON.parse(JSON.stringify(userSudoku));

  return sudoku
}
  

const createSudoku = (generatedSudoku, solvedSudoku) => {
  mainDiv.innerHTML = '';
  generatedSudoku.forEach((row, y) => {
    row.forEach((square, x) => {
      const newSquare = document.createElement("div");
      newSquare.setAttribute("class", "smallSquare");
      newSquare.setAttribute("id", `r${y}c${x}`);
      if (square === 0) {
        newSquare.innerHTML = '';
        newSquare.setAttribute('contenteditable', 'true');
        newSquare.addEventListener('input', (e) => {
          const { id, innerHTML} = e.target;
          let row = id[1];
          let col = id[3];
          let number = Number(innerHTML);
          if (number < 10 || number > 0) {
            generatedSudoku[row][col] = number;
          } else {
            alert('Enter a valid number between 1 and 9');
            newSquare.innerHTML = '';
          }
          if (JSON.stringify(generatedSudoku) === JSON.stringify(solvedSudoku)) {
            alert('Congrats!')
          }
        })
        newSquare.addEventListener('keydown', (e) => {
          let count = 0;
          if (!e.code >= 49 && !e.code <= 57) {
            alert('Enter valid number');
          }
          if (count !== 0) {
            alert('You can only enter one number');
          }
          count++;
        })
      } else {
        newSquare.innerHTML = square;
      }
      mainDiv.appendChild(newSquare);
    })
  })
}

const createSudoku2 = (generatedSudoku) => {
  solvedDiv.innerHTML = '';
  generatedSudoku.forEach(row => {
    row.forEach(square => {
      const newSquare = document.createElement("div");
      newSquare.setAttribute("class", "smallSquare");
      if (square === 0) {
        newSquare.innerHTML = '';
        newSquare.setAttribute('contenteditable', 'true');
      } else {
        newSquare.innerHTML = square;
      }
      solvedDiv.appendChild(newSquare);
    })
  })
}

genButton.addEventListener('click', () => {
  let randomSudoku = generateRandomSudoku(30);
  let viewSudoku = JSON.parse(JSON.stringify(randomSudoku));

  console.log(solveSudoku(randomSudoku));

  if (solveSudoku(randomSudoku)) {
    createSudoku(viewSudoku, randomSudoku);
  }
});