import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckBoardService {

  constructor() { }

  checkGameStatus(board: number[][]): number | null {
    if (this.checkWinningState(board, 1)) {
      return 1;
    }

    if (this.checkWinningState(board, 2)) {
      return 2;
    }

    if (this.isBoardFull(board)) {
      return 3;
    }

    return null;
  }


  boardSize = 10;
  allWinningPatterns: number[][][] = this.generateWinningPatterns(this.boardSize);

  generateWinningPatterns(boardSize: number): number[][][] {
    const patterns: number[][][] = [];

    // Horizontal patterns
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col <= boardSize - 5; col++) {
        const pattern: number[][] = [];
        for (let i = 0; i < 5; i++) {
          pattern.push([row, col + i]);
        }
        patterns.push(pattern);
      }
    }

    // Vertical patterns
    for (let row = 0; row <= boardSize - 5; row++) {
      for (let col = 0; col < boardSize; col++) {
        const pattern: number[][] = [];
        for (let i = 0; i < 5; i++) {
          pattern.push([row + i, col]);
        }
        patterns.push(pattern);
      }
    }

    // Diagonal patterns (top-left to bottom-right)
    for (let row = 0; row <= boardSize - 5; row++) {
      for (let col = 0; col <= boardSize - 5; col++) {
        const pattern: number[][] = [];
        for (let i = 0; i < 5; i++) {
          pattern.push([row + i, col + i]);
        }
        patterns.push(pattern);
      }
    }

    // Diagonal patterns (top-right to bottom-left)
    for (let row = 0; row <= boardSize - 5; row++) {
      for (let col = boardSize - 1; col >= 4; col--) {
        const pattern: number[][] = [];
        for (let i = 0; i < 5; i++) {
          pattern.push([row + i, col - i]);
        }
        patterns.push(pattern);
      }
    }

    return patterns;
  }


  checkWinningState(board: number[][], player: number): boolean {
    for (const pattern of this.allWinningPatterns) {
      if (this.checkPattern(board, pattern, player)) {
        return true;
      }
    }
    return false;
  }

  checkPattern(board: number[][], pattern: number[][], player: number): boolean {
    for (const [row, col] of pattern) {
      if (board[row][col] !== player) {
        return false;
      }
    }
    return true;
  }

  isBoardFull(board: number[][]): boolean {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }
}
