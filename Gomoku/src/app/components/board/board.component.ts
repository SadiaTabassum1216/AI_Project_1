import { Component } from '@angular/core';
import { CheckBoardService } from 'src/app/services/check-board.service';
import { MinimaxJavaService } from 'src/app/services/minimax-java.service';
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

  //X means human. O means computer.

  constructor(
     private minimaxService: MinimaxService,
    private minimax_java: MinimaxJavaService,
    private check: CheckBoardService) {
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

      // console.log("before: ")
      // console.log('Row: '+row+' Column: '+column)

      this.board[row][column] = this.currentPlayer;

      // console.log("AI: "+this.evaluation.evaluate(this.board, false, true));
      // console.log("Human: "+this.evaluation.evaluate(this.board, true, true));

      if (this.check.checkWinningState(this.board, this.currentPlayer)) {
        setTimeout(() => {
          if (this.currentPlayer === 'X') {
            alert('Human wins!');
          } else {
            alert('Computer wins!');
          }
          this.newGame();
        }, 200);
      } else if (this.check.checkGameStatus(this.board) === 'Tie') {
        setTimeout(() => {
          alert('It\'s a tie!');
          this.newGame();
        }, 200);
      }
       else {
        // Switch turn
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

        if (this.currentPlayer === 'O') {
          // const computerMove = this.minimax_java.calculateComputerMove(this.board);
          const computerMove = this.minimaxService.calculateComputerMove(this.board);
          if (computerMove) {
            const [computerRow, computerColumn] = computerMove;
            // console.log("Score: "+computerMove);
            this.makeMove(computerRow, computerColumn);
          }
        }

        //print current state
         console.log('Row: '+row+' Column: '+column)
         console.log('Print board: ');
         for (let c = 0; c < this.board[0].length; c++) {
           let rowStr = '';
           for (let r = 0; r < this.board.length; r++) {
             // Check if the current cell is blank (empty)
             if (this.board[r][c] === '') {
               rowStr += '_ ';
             } else {
               rowStr += this.board[r][c] + ' ';
             }
           }
           console.log(rowStr);
         }
         
      }
    }
  }

}