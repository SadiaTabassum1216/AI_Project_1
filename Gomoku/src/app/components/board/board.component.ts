import { Component } from '@angular/core';
import { MinimaxService } from 'src/app/services/minimax.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  boardSize = 10;
  board: string[][] = [];
  currentPlayer: string = 'X';

  constructor(private minimaxService: MinimaxService) {
    this.initializeBoard();
  }

  newGame(): void {
    this.initializeBoard();
    this.currentPlayer = 'X';
  }
  initializeBoard(): void {
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = Array(this.boardSize).fill('');
    }
  }
  makeMove(row: number, column: number): void {
    if (this.board[row][column] === '') {
      this.board[row][column] = this.currentPlayer;
      if (this.checkForWin(row, column)) {
        // alert(`${this.currentPlayer} wins!`);
        alert( 'Human wins!');
        this.initializeBoard();
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

        // Computer's move (Player O)
        
        // const computerMove = this.minimaxService.calculateComputerMove(this.board);
        // if (computerMove) {
        //   const [computerRow, computerColumn] = computerMove;
        //   this.makeMove(computerRow, computerColumn);
        // }

        if (this.currentPlayer === 'O') {
          this.makeComputerMove();
        }
      }
    }
  }

  makeComputerMove(): void {
    // Generate a random move for Player O
    let row, column;
    do {
      row = Math.floor(Math.random() * this.boardSize);
      column = Math.floor(Math.random() * this.boardSize);
    } while (this.board[row][column] !== '');

    // Make the move for Player O
    this.board[row][column] = 'O';

    // Check if Player O wins
    if (this.checkForWin(row, column)) {
      alert('Computer wins!');
      this.initializeBoard();
    } else {
      // Switch back to Player X's turn
      this.currentPlayer = 'X';
    }
  }


  checkForWin(row: number, column: number): boolean {
    const currentPlayer = this.board[row][column];
  
    // Check row
    if (this.checkConsecutive(row, column, 0, 1, currentPlayer) >= 5) {
      return true;
    }
  
    // Check column
    if (this.checkConsecutive(row, column, 1, 0, currentPlayer) >= 5) {
      return true;
    }
  
    // Check diagonal from top-left to bottom-right
    if (this.checkConsecutive(row, column, 1, 1, currentPlayer) >= 5) {
      return true;
    }
  
    // Check diagonal from top-right to bottom-left
    if (this.checkConsecutive(row, column, 1, -1, currentPlayer) >= 5) {
      return true;
    }
  
    return false;
  }
  
  checkConsecutive(
    row: number,
    column: number,
    rowDirection: number,
    colDirection: number,
    player: string
  ): number {
    let consecutiveCount = 0;
    const boardSize = this.boardSize;
  
    // Check in both directions (forward and backward)
    for (let i = -4; i <= 4; i++) {
      const newRow = row + i * rowDirection;
      const newCol = column + i * colDirection;
  
      if (
        newRow >= 0 &&
        newRow < boardSize &&
        newCol >= 0 &&
        newCol < boardSize &&
        this.board[newRow][newCol] === player
      ) {
        consecutiveCount++;
      } else {
        break; // Stop counting if consecutive sequence is broken
      }
    }
  
    return consecutiveCount;
  }
  

  invalidMove() {
    alert('Invalid move!');
  }
}
