import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { CheckBoardService } from 'src/app/services/check-board.service';
import { MinimaxService } from 'src/app/services/minimax.service';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  boardSize = 10;
  board: number[][] = [];
  currentPlayer: number = 2; // 2 for human, 1 for AI


  constructor(
    private minimaxService: MinimaxService,
    private check: CheckBoardService,
    private dialog: MatDialog
  ) {
    this.newGame();

  }

  newGame(): void {
    this.initializeBoard();
    this.showWelcomeModal();
    this.currentPlayer = 2; // human (2)
  }

  initializeBoard(): void {
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = Array(this.boardSize).fill(0);
    }
  }

  showCustomMessage(message: string): void {
    const dialogRef = this.dialog.open(MessageModalComponent, {
      width: '300px',
      data: { message }
    });

    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }

  showWelcomeModal() {
    this.dialog.open(WelcomeComponent, {
      width: '500px',
    });
  }

  makeMove(row: number, column: number): void {
    console.log(this.minimaxService.maxDepth);
    if (this.board[row][column] === 0) {
      this.board[row][column] = this.currentPlayer;

      if (this.check.checkWinningState(this.board, this.currentPlayer === 2 ? 2 : 1)) {
        setTimeout(() => {
          if (this.currentPlayer === 2) {
            this.showCustomMessage('Human wins!');
          } else {
            this.showCustomMessage('Computer wins!');
          }
        }, 200);
      } else if (this.check.checkGameStatus(this.board) === 3) {
        setTimeout(() => {
          this.showCustomMessage("It's a tie!");
        }, 200);
      } else {
        this.currentPlayer = this.currentPlayer === 2 ? 1 : 2;

        if (this.currentPlayer === 1) {
          const computerMove = this.minimaxService.calculateComputerMove(this.board);
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
