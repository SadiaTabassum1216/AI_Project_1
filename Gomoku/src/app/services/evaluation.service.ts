import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  currentPlayer: string= 'O';

  constructor() { }
  // Evaluate the board

// evaluate(board: string[][]): number {
//   const player = 'O'; // The player for which to calculate the score
//   const scoringPatterns: any = {
//     '11110': 1000,  // Five in a row with one empty end
//     '011110': 500, // Four in a row with one empty end
//     '01110': 50,   // Four in a row with no empty end
//     '001110': 25,  // Three in a row with one empty end
//     '011100': 25,  // Three in a row with one empty end
//     '0001110': 5,  // Two in a row with one empty end
//     '011000': 5,   // Two in a row with one empty end
//     '001100': 2,   // Two in a row with no empty end
//     '000110': 2    // Two in a row with no empty end
//   };

//   let score = 0;

//   // Helper function to calculate score for a pattern
//   const calculatePatternScore = (pattern: string): any => {
//     for (const key in scoringPatterns) {
//       if (pattern.includes(key)) {
//         score += scoringPatterns[key];
//       }
//     }
//   };

//   const boardSize = 10;

//   // Check horizontal patterns
//   for (let row = 0; row < boardSize; row++) {
//     for (let col = 0; col <= boardSize - 5; col++) {
//       const pattern = board[row].slice(col, col + 5).join('');
//       if (pattern.includes(player)) {
//         calculatePatternScore(pattern);
//       }
//     }
//   }

//   // Check vertical patterns
//   for (let col = 0; col < boardSize; col++) {
//     for (let row = 0; row <= boardSize - 5; row++) {
//       const pattern = Array.from({ length: 5 }, (_, i) => board[row + i][col]).join('');
//       if (pattern.includes(player)) {
//         calculatePatternScore(pattern);
//       }
//     }
//   }

//   // Check diagonal patterns (top-left to bottom-right)
//   for (let row = 0; row <= boardSize - 5; row++) {
//     for (let col = 0; col <= boardSize - 5; col++) {
//       const pattern = Array.from({ length: 5 }, (_, i) => board[row + i][col + i]).join('');
//       if (pattern.includes(player)) {
//         calculatePatternScore(pattern);
//       }
//     }
//   }

//   // Check diagonal patterns (top-right to bottom-left)
//   for (let row = 0; row <= boardSize - 5; row++) {
//     for (let col = boardSize - 1; col >= 4; col--) {
//       const pattern = Array.from({ length: 5 }, (_, i) => board[row + i][col - i]).join('');
//       if (pattern.includes(player)) {
//         calculatePatternScore(pattern);
//       }
//     }
//   }

//   return score;
// }


  // Evaluate the board
  
  // evaluate(board: string[][]): number {
  //   // Define the score values for different game states
  //   const winScore = 10000;
  //   const loseScore = -10000;
  //   const tieScore = 0;
  //   const blockingScore = 100;

  //   // Check for a winning state for 'O'
  //   if (this.checkWinningState(board, 'O')) {
  //     return winScore;
  //   }

  //   // Check for a winning state for 'X'
  //   if (this.checkWinningState(board, 'X')) {
  //     return loseScore;
  //   }
    
  //   const boardString = board.map(row => row.join('')).join('');
  //   const blockingPatterns = ['XXXX_', 'XXX_X', 'XX_XX', 'X_XXX', 'XXXXX', 'X_XXX', 'XX_XX', 'XXX_X', '_XXXX', 'X___X'];
  //   for (const pattern of blockingPatterns) {
  //     if (boardString.includes(pattern)) {
  //       return blockingScore;
  //     }
  //   }
  //   const opponentWinningPatterns = ['OOOO_', 'OOO_O', 'OO_OO', 'O_OOO'];
  //   for (const pattern of opponentWinningPatterns) {
  //     if (boardString.includes(pattern)) {
  //       return -blockingScore;
  //     }
  //   }
  //   // If neither 'O' nor 'X' has won, return a tie score
  //   return tieScore;
  // }

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
