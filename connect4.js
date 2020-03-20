class Game {
  constructor(playerOne, playerTwo, height = 6, width = 7) {
    this.players = [playerOne, playerTwo];
    this.currentPlayer = this.players[0];
    this.gameOver = false;
    this.HEIGHT = height;
    this.WIDTH = width;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    this.board = []; // REVISIT
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");
    // clear previous board
    board.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    this.handleGameClick = this.handleClick.bind(this); // REVISIT
    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");

    piece.classList.add("piece");
    piece.style.backgroundColor = this.currentPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    document
      .getElementById("column-top")
      .removeEventListener("click", this.handleGameClick);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currentPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(
        `Player ${this.players.indexOf(this.currentPlayer) + 1} won!`
      );
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currentPlayer =
      this.currentPlayer === this.players[0]
        ? this.players[1]
        : this.players[0];
  }

  checkForWin() {
    // REVISIT
    const _win = cells => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currentPlayer
      );
    };

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3]
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x]
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3]
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3]
        ];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

const colorForm = document.getElementById("colorForm");

colorForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const colorOne = event.target.colorOne.value || "blue";
  const colorTwo = event.target.colorTwo.value || "red";

  new Game(new Player(colorOne), new Player(colorTwo));

  event.target.colorOne.value = " ";
  event.target.colorTwo.value = " ";
});
