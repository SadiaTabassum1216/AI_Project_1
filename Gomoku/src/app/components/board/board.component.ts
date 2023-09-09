
import { Component } from '@angular/core';
import { CheckBoardService } from 'src/app/services/check-board.service';
import { MinimaxService } from 'src/app/services/minimax.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  boardSize = 10;
  board: number[][] = []; // Change the type to number[][]
  currentPlayer: number = 2; // 2 for human, 1 for AI

  constructor(
     private minimaxService: MinimaxService,
    private check: CheckBoardService
  ) {
    this.initializeBoard();
  }

  newGame(): void {
    this.initializeBoard();
    this.currentPlayer = 2; // Set the initial player to human (2)
  }
  
  initializeBoard(): void {
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = Array(this.boardSize).fill(0); // Fill the board with zeros (0) initially
    }
  }

  makeMove(row: number, column: number): void {
    if (this.board[row][column] === 0) {
      this.board[row][column] = this.currentPlayer; // Set the current player's number on the board

      if (this.check.checkWinningState(this.board, this.currentPlayer === 2 ? 2 : 1)) {
        setTimeout(() => {
          if (this.currentPlayer === 2) {
            alert('Human wins!');
          } else {
            alert('Computer wins!');
          }
          this.newGame();
        }, 200);
      } else if (this.check.checkGameStatus(this.board) === 3) {
        setTimeout(() => {
          alert("It's a tie!");
          this.newGame();
        }, 200);
      } else {
        // Switch turn
        this.currentPlayer = this.currentPlayer === 2 ? 1 : 2; // Toggle between 2 (human) and 1 (AI)

        if (this.currentPlayer === 1) {
          const computerMove = this.minimaxService.calculateComputerMove(this.board); // to run java logic
          if (computerMove) {
            const [computerRow, computerColumn] = computerMove;
            this.makeMove(computerRow, computerColumn);
          }
        }

        // Print current state
        console.log('Row: ' + row + ' Column: ' + column);
        console.log('Print board: ');
        for (let c = 0; c < this.board[0].length; c++) {
          let rowStr = '';
          for (let r = 0; r < this.board.length; r++) {
            // Check if the current cell is blank (empty)
            if (this.board[r][c] === 0) {
              rowStr += '_ ';
            } else if (this.board[r][c] === 2) {
              rowStr += 'X ';
            } else {
              rowStr += 'O ';
            }
          }
          console.log(rowStr);
        }
      }
    }
  }
}
