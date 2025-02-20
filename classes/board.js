import { Pawn } from "./pawn.js";
import { Rook } from "./rook.js";
import { Bishop } from "./bishop.js";
import { Queen } from "./queen.js";
import { King } from "./king.js";
import { Knight } from "./knight.js";
//import { doubleCheck } from "../alternate-board-states/board-states.js";

export class Board {
  constructor() {
    this.gameState = this.#setStartingGameState();
    this.#generateBoard();
    this.activePlayer = { color: "white" }; // switch back to white after testing double checl
    this.#generatePieceImages();
    this.#addEventListeners();
  }

  #findPiece(y_start, x_start, direction, gameState) {
    let y = y_start;
    let x = x_start;
    // Find Knight
    const knightMoves = new Set([
      "UP_TWO_LEFT_ONE",
      "UP_ONE_LEFT_TWO",
      "UP_TWO_RIGHT_ONE",
      "UP_ONE_RIGHT_TWO",
      "DOWN_TWO_RIGHT_ONE",
      "DOWN_ONE_RIGHT_TWO",
      "DOWN_TWO_LEFT_ONE",
      "DOWN_ONE_LEFT_TWO",
    ]);
    // Not sure why theses need to be disjointed but whatever
    if (knightMoves.has(direction)) {
      switch (direction) {
        case "UP_TWO_LEFT_ONE":
          y = y - 2;
          x = x - 1;
          break;
        case "UP_ONE_LEFT_TWO":
          y = y - 1;
          x = x - 2;
          break;
        case "UP_TWO_RIGHT_ONE":
          y = y - 2;
          x = x + 1;
          break;
        case "UP_ONE_RIGHT_TWO":
          y = y - 1;
          x = x + 2;
          break;
        case "DOWN_TWO_RIGHT_ONE":
          y = y + 2;
          x = x + 1;
          break;
        case "DOWN_ONE_RIGHT_TWO":
          y = y + 1;
          x = x + 2;
          break;
        case "DOWN_ONE_LEFT_TWO":
          y = y + 1;
          x = x - 2;
          break;
        case "DOWN_TWO_LEFT_ONE":
          y = y + 2;
          x = x - 1;
          break;
      }
      if (y < 0 || y > 7 || x < 0 || x > 7) return null;
      const piece = gameState[y][x];
      return piece;
    }

    while (true) {
      // Move first
      switch (direction) {
        case "UP":
          y -= 1;
          break;
        case "DOWN":
          y += 1;
          break;
        case "LEFT":
          x -= 1;
          break;
        case "RIGHT":
          x += 1;
          break;
        case "UP_LEFT":
          y -= 1;
          x -= 1;
          break;
        case "UP_RIGHT":
          y -= 1;
          x += 1;
          break;
        case "DOWN_LEFT":
          y += 1;
          x -= 1;
          break;
        case "DOWN_RIGHT":
          y += 1;
          x += 1;
          break;
      }
      // Check bounds before accessing the game state
      if (y < 0 || y > 7 || x < 0 || x > 7) break;

      const piece = gameState[y][x];
      if (piece) return piece;
    }

    return null;
  }

  #getPiece(y, x) {
    const pieceLookup = {
      "0-0": new Rook("rook", "black", this, y, x),
      "0-1": new Knight("knight", "black", this, y, x),
      "0-2": new Bishop("bishop", "black", this, y, x),
      "0-3": new Queen("queen", "black", this, y, x),
      "0-4": new King("king", "black", this, y, x),
      "0-5": new Bishop("bishop", "black", this, y, x),
      "0-6": new Knight("knight", "black", this, y, x),
      "0-7": new Rook("rook", "black", this, y, x),
      "1-0": new Pawn("pawn", "black", this, y, x),
      "1-1": new Pawn("pawn", "black", this, y, x),
      "1-2": new Pawn("pawn", "black", this, y, x),
      "1-3": new Pawn("pawn", "black", this, y, x),
      "1-4": new Pawn("pawn", "black", this, y, x),
      "1-5": new Pawn("pawn", "black", this, y, x),
      "1-6": new Pawn("pawn", "black", this, y, x),
      "1-7": new Pawn("pawn", "black", this, y, x),
      "6-0": new Pawn("pawn", "white", this, y, x),
      "6-1": new Pawn("pawn", "white", this, y, x),
      "6-2": new Pawn("pawn", "white", this, y, x),
      "6-3": new Pawn("pawn", "white", this, y, x),
      "6-4": new Pawn("pawn", "white", this, y, x),
      "6-5": new Pawn("pawn", "white", this, y, x),
      "6-6": new Pawn("pawn", "white", this, y, x),
      "6-7": new Pawn("pawn", "white", this, y, x),
      "7-0": new Rook("rook", "white", this, y, x),
      "7-1": new Knight("knight", "white", this, y, x),
      "7-2": new Bishop("bishop", "white", this, y, x),
      "7-3": new Queen("queen", "white", this, y, x),
      "7-4": new King("king", "white", this, y, x),
      "7-5": new Bishop("bishop", "white", this, y, x),
      "7-6": new Knight("knight", "white", this, y, x),
      "7-7": new Rook("rook", "white", this, y, x),
    };
    return pieceLookup[`${y}-${x}`];
  }
  // Starting board state. Only called once on app start
  #setStartingGameState() {
    const gameState = [];
    for (let y = 0; y < 8; y++) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        row.push(this.#getPiece(y, x));
        //row.push(doubleCheck(y, x, this));
      }
      gameState.push(row);
    }
    return gameState;
  }
  // Selects the "board-container" div, then appends the rows and spaces to it.
  #generateBoard() {
    const boardContainer = document.getElementById("board-container");

    for (let y = 0; y < 8; y++) {
      let row = document.createElement("div");
      let colorIsWhite = true;
      row.classList.add("board-row");

      if (y % 2 != 0) {
        colorIsWhite = false;
      }

      for (let x = 0; x < 8; x++) {
        const space = document.createElement("div");
        space.id = `${y}-${x}`;

        if (colorIsWhite) {
          space.classList.add("space");
          space.classList.add("white");
        } else {
          space.classList.add("space");
          space.classList.add("beige");
        }

        row.appendChild(space);
        colorIsWhite = !colorIsWhite;
      }
      boardContainer.appendChild(row);
    }
  }
  // Render pieces on board according to 'gameState'
  #generatePieceImages() {
    for (let y = 0; y < this.gameState.length; y++) {
      for (let x = 0; x < this.gameState[0].length; x++) {
        const space = document.getElementById(`${y}-${x}`);
        // If gamestate[y][x] is null, remove img
        if (!this.gameState[y][x]) {
          const img = space.querySelector("img");
          if (img) {
            img.remove();
          }
          continue;
        }

        const piece = this.gameState[y][x];
        const img = document.createElement("img");
        img.src = `./pieces/${piece.type}-${piece.color}.svg`;
        img.width = 50;
        img.height = 50;
        img.dataset.coordinates = `${y}-${x}`;
        space.appendChild(img);
      }
    }
  }
  // Possibly refactor this, bad code smell
  #addEventListeners() {
    console.log(this.gameState);
    let draggedImg = null;
    let draggedPiece = null;
    let y_start = null;
    let x_start = null;
    let y_end = null;
    let x_end = null;

    document.querySelectorAll("img").forEach((piece) => {
      piece.addEventListener("dragstart", (e) => {
        draggedImg = e.target;
        if (!draggedImg) return;

        [y_start, x_start] = draggedImg.dataset.coordinates
          .split("-")
          .map(Number);
        draggedPiece = this.gameState[y_start][x_start];

        if (!draggedPiece) return;

        setTimeout(() => {
          e.target.style.display = "none"; // Hide the piece while dragging
        }, 0);
      });

      piece.addEventListener("dragend", (e) => {
        setTimeout(() => {
          e.target.style.display = "flex";
          draggedImg = null;
          draggedPiece = null;
        }, 0);
      });
    });

    document.querySelectorAll(".space").forEach((space) => {
      space.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow drop
      });

      space.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!draggedImg || !draggedPiece) return;

        [y_end, x_end] = space.id.split("-").map(Number);

        if (
          !draggedPiece.isMoveValid(
            y_end,
            x_end,
            this.gameState,
            this.activePlayer
          )
        )
          return;

        const moveIsSafe = draggedPiece.isMoveSafe(
          y_end,
          x_end,
          this.gameState
        );
        if (!moveIsSafe) return;

        draggedPiece.executeMove(
          {
            y_end: y_end,
            x_end: x_end,
          },
          this.gameState
        );

        // Remove img (if killed piece)
        const img = document
          .getElementById(`${y_end}-${x_end}`)
          .querySelector("img");
        if (img) img.remove();
        // Put the dragged image to its resting location
        space.appendChild(draggedImg);
        draggedImg.dataset.coordinates = `${y_end}-${x_end}`;
        this.#passTurn();
      });
    });
  }
  // Move this to King?
  #canMoveOutOfCheck() {
    const king = this.#getKing(this.gameState);
    const possibleMoves = {
      UP: {
        is_valid: king.isMoveValid(
          king.y - 1,
          king.x,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y - 1,
          x_end: king.x,
        },
      },
      DOWN: {
        is_valid: king.isMoveValid(
          king.y + 1,
          king.x,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y + 1,
          x_end: king.x,
        },
      },
      LEFT: {
        is_valid: king.isMoveValid(
          king.y,
          king.x - 1,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y,
          x_end: king.x - 1,
        },
      },
      RIGHT: {
        is_valid: king.isMoveValid(
          king.y,
          king.x + 1,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y,
          x_end: king.x + 1,
        },
      },
      UP_RIGHT: {
        is_valid: king.isMoveValid(
          king.y - 1,
          king.x + 1,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y - 1,
          x_end: king.x + 1,
        },
      },
      UP_LEFT: {
        is_valid: king.isMoveValid(
          king.y - 1,
          king.x - 1,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y - 1,
          x_end: king.x - 1,
        },
      },
      DOWN_RIGHT: {
        is_valid: king.isMoveValid(
          king.y + 1,
          king.x + 1,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y + 1,
          x_end: king.x + 1,
        },
      },
      DOWN_LEFT: {
        is_valid: king.isMoveValid(
          king.y + 1,
          king.x - 1,
          this.gameState,
          this.activePlayer
        ),
        coords: {
          y_start: king.y,
          x_start: king.x,
          y_end: king.y + 1,
          x_end: king.x - 1,
        },
      },
    };
    const validMoves = [];
    for (const direction in possibleMoves) {
      // We need to loop over all directions and perform those moves if valid
      const { y_start, x_start, y_end, x_end } =
        possibleMoves[direction]["coords"];
      if (!possibleMoves[direction]["is_valid"]) continue;
      const moveIsSafe = king.isMoveSafe(y_end, x_end, this.gameState);
      validMoves.push(moveIsSafe);
    }

    for (const bool of validMoves) {
      if (bool) return true;
    }
    return false;
  }

  #getKing(gameState) {
    let king = null;

    for (let i = 0; i < gameState.length; i++) {
      for (let j = 0; j < gameState[0].length; j++) {
        const piece = gameState[i][j];
        if (
          piece?.color == this.activePlayer["color"] &&
          piece.type == "king"
        ) {
          king = piece;
          break;
        }
      }
    }
    return king;
  }
  // Could pass king to this as well if we wanted to decouple
  #canBlockOrKillThreat(threats) {
    const king = this.#getKing(this.gameState);
    const spacesSet = new Set();
    for (const threat of threats) {
      this.#getThreatPath(threat, king, spacesSet);
    }
    // We now have the set of spaces we must block.
    const pieces = [];
    for (const row of this.gameState) {
      for (const piece of row) {
        if (piece?.color == this.activePlayer["color"] && piece.type != "king")
          pieces.push(piece);
      }
    }

    const validMoves = [];
    for (const space of spacesSet) {
      let y = space[0];
      let x = space[1];
      for (const piece of pieces) {
        const isValid = piece.isMoveValid(
          y,
          x,
          this.gameState,
          this.activePlayer
        );
        if (isValid) {
          validMoves.push([piece, [y, x]]);
        }
      }
    }

    for (const [piece, [y, x]] of validMoves) {
      const moveIsSafe = piece.isMoveSafe(y, x, this.gameState);
      if (moveIsSafe) return true;
    }
    return false;
  }
  // Move this to King?
  #getThreatPath(threat, king, spacesSet) {
    let direction = null;

    if (threat.y > king.y && threat.x < king.x) direction = "DOWN_LEFT";
    else if (threat.y > king.y && threat.x > king.x) direction = "DOWN_RIGHT";
    else if (threat.y < king.y && threat.x < king.x) direction = "UP_LEFT";
    else if (threat.y < king.y && threat.x > king.x) direction = "UP_RIGHT";
    else if (threat.y > king.y) direction = "UP";
    else if (threat.y < king.y) direction = "DOWN";
    else if (threat.x < king.x) direction = "LEFT";
    else if (threat.x > king.x) direction = "RIGHT";

    let y = king.y;
    let x = king.x;

    while (true) {
      switch (direction) {
        case "UP":
          y = y - 1;
          break;
        case "DOWN":
          y = y + 1;
          break;
        case "LEFT":
          x = x - 1;
          break;
        case "RIGHT":
          x = x + 1;
          break;
        case "DOWN_LEFT":
          y = y + 1;
          x = x - 1;
          break;
        case "DOWN_RIGHT":
          y = y + 1;
          x = x + 1;
          break;
        case "UP_LEFT":
          y = y - 1;
          x = x - 1;
          break;
        case "UP_RIGHT":
          y = y - 1;
          x = x + 1;
          break;
      }
      spacesSet.add([y, x]);
      if (y == threat.y && x == threat.x) break;
    }
  }
  // Move this to King?
  // To decouple this from Board, you could just pass in the king
  // But you would also have to find all pieces and pass to this function as well...
  getThreats(gameState) {
    const enemyColor =
      this.activePlayer["color"] == "white"
        ? { color: "black" }
        : { color: "white" };
    const king = this.#getKing(gameState);

    const directions = [
      "UP",
      "DOWN",
      "LEFT",
      "RIGHT",
      "UP_RIGHT",
      "UP_LEFT",
      "DOWN_RIGHT",
      "DOWN_LEFT",
      "UP_TWO_LEFT_ONE",
      "UP_ONE_LEFT_TWO",
      "UP_TWO_RIGHT_ONE",
      "UP_ONE_RIGHT_TWO",
      "DOWN_TWO_RIGHT_ONE",
      "DOWN_ONE_RIGHT_TWO",
      "DOWN_TWO_LEFT_ONE",
      "DOWN_ONE_LEFT_TWO",
    ];

    const threats = [];

    for (const direction of directions) {
      const foundPiece = this.#findPiece(king.y, king.x, direction, gameState);
      if (foundPiece) {
        const piece = foundPiece; // This assignement is useless I think
        if (piece.color !== king.color) {
          const isValid = piece.isMoveValid(
            king.y,
            king.x,
            gameState,
            enemyColor
          );
          if (isValid) threats.push(piece);
        }
      }
    }
    return threats;
  }

  #passTurn() {
    const activePlayerDiv = document.getElementById("active-player-div");
    activePlayerDiv.innerText = "Active player: White";
    this.activePlayer["color"] == "white"
      ? (activePlayerDiv.innerText = "Active player: Black")
      : (activePlayerDiv.innerText = "Active player: White");
    this.activePlayer["color"] == "white"
      ? (this.activePlayer["color"] = "black")
      : (this.activePlayer["color"] = "white");
    const threats = this.getThreats(this.gameState);
    const checkDiv = document.getElementById("check") ?? false;
    if (threats.length == 0) {
      checkDiv.innerText = "";
      return;
    }
    let canMoveOutOfCheck = null;
    let canBlockOrKillThreat = null;
    canMoveOutOfCheck = this.#canMoveOutOfCheck();
    if (!canMoveOutOfCheck) {
      canBlockOrKillThreat = this.#canBlockOrKillThreat(threats);
    }
    checkDiv.innerText = `${this.activePlayer["color"]} king is in check`;
    if (!canBlockOrKillThreat && !canMoveOutOfCheck) {
      checkDiv.innerText = `Checkmate. ${this.activePlayer["color"]} loses!`;
    }
  }
}
