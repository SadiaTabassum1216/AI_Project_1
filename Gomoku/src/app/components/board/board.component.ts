import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  boardSize = 10; // Adjust the board size if needed
  board: string[][] = [];
  currentPlayer: string = 'X'; // Player X starts

  constructor() {
    this.initializeBoard();
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
        alert(`${this.currentPlayer} wins!`);
        this.initializeBoard();
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  }

  checkForWin(row: number, column: number): boolean {
    // Implement your win-checking logic here
    // Return true if the current player wins
    return false;
  }

  invalidMove(){
    alert("Invalid move!");
  }
}
