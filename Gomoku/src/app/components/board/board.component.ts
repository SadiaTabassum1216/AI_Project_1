import { Component } from '@angular/core';
import { EvaluationService } from 'src/app/services/evaluation.service';
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

  constructor(private minimaxService: MinimaxService, private evaluation: EvaluationService) {
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

      //print current state
      console.log('Row: '+row+' Column: '+column)
      console.log('Print board: ')
      for (let r = 0; r < this.board.length; r++) {
        let rowStr = '';
        for (let c = 0; c < this.board[r].length; c++) {
          rowStr += this.board[r][c] + '_ ';
        }
        console.log(rowStr);
      }
      
      this.board[row][column] = this.currentPlayer;

      if (this.evaluation.checkWinningState(this.board, this.currentPlayer)) {
        setTimeout(() => {
          if (this.currentPlayer === 'X') {
            alert('Human wins!');
          } else {
            alert('Computer wins!');
          }
           this.newGame();
           }, 200);
      } else {
        // Switch turn
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

        if (this.currentPlayer === 'O') {
          const computerMove = this.minimaxService.calculateComputerMove(this.board);
          if (computerMove) {
            const [computerRow, computerColumn] = computerMove;
            // console.log("Score: "+computerMove);
            this.makeMove(computerRow, computerColumn);
          }
        }
      }
    }
  }

}