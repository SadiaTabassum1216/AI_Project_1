import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  currentPlayer: string= 'O';

  constructor() { }
 
  evaluate(board: string[][]): number {
    const winScore = 10000;
    const loseScore = -10000;
    const tieScore = 0;
  
    // Check for a winning state for 'O'
    if (this.checkWinningState(board, 'O')) {
      return winScore;
    }
  
    // Check for a winning state for 'X'
    if (this.checkWinningState(board, 'X')) {
      return loseScore;
    }
    // If neither 'O' nor 'X' has won, return a tie score
    return tieScore;
  }
  

   // Define the dimensions of the game board
   boardSize = 10;

   // Helper function to generate all possible horizontal, vertical, and diagonal winning patterns
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
 
   // Combine all winning patterns into one array
   allWinningPatterns: number[][][] = this.generateWinningPatterns(this.boardSize);
 
   // Helper function to check if a player has won
   checkWinningState(board: string[][], player: string): boolean {
     for (const pattern of this.allWinningPatterns) {
       if (this.checkPattern(board, pattern, player)) {
         return true;
       }
     }
     return false;
   }
 
   // Helper function to check if a specific pattern is present on the board
   checkPattern(board: string[][], pattern: number[][], player: string): boolean {
     for (const [row, col] of pattern) {
       if (board[row][col] !== player) {
         return false;
       }
     }
     return true;
   }

}
