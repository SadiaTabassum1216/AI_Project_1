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
  
  evaluate(board: string[][]): number {
    // Define the score values for different game states
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

  // evaluate(board: string[][]): number {
  //   const scoringPatterns: { [pattern: string]: number } = {
  //     '11110': 1000,  // Five Xs in a row with one empty end
  //     '011110': 500, // Four Xs in a row with one empty end
  //     '01110': 50,   // Four Xs in a row with no empty end
  //     '001110': 25,  // Three Xs in a row with one empty end
  //     '011100': 25,  // Three Xs in a row with one empty end
  //     '0001110': 5,  // Two Xs in a row with one empty end
  //     '011000': 5,   // Two Xs in a row with one empty end
  //     '001100': 2,   // Two Xs in a row with no empty end
  //     '000110': 2,   // Two Xs in a row with no empty end
  //   };
  
  //   let score = 0;

  
  //   // Convert the board into a string representation for pattern matching
  //   const boardString = board.map(row => row.join('')).join('');
  
  //   for (const pattern in scoringPatterns) {
  //     const regex = new RegExp(pattern.replace(/0/g, '\\d').replace(/1/g, this.currentPlayer === 'X' ? 'X' : 'O'), 'g');
  //     const matches = boardString.match(regex);
  //     if (matches) {
  //       score += matches.length * scoringPatterns[pattern];
  //     }
  //   }
  
  //   return score;
  // }
  

 boardSize = 10;

 // Helper function to generate all possible horizontal winning patterns
  generateHorizontalWinningPatterns(boardSize: number): number[][][] {
   const patterns: number[][][] = [];
 
   for (let row = 0; row < boardSize; row++) {
     for (let col = 0; col <= boardSize - 5; col++) {
       const pattern: number[][] = [];
       for (let i = 0; i < 5; i++) {
         pattern.push([row, col + i]);
       }
       patterns.push(pattern);
     }
   }
 
   return patterns;
 }
 
 // Helper function to generate all possible vertical winning patterns
  generateVerticalWinningPatterns(boardSize: number): number[][][] {
   const patterns: number[][][] = [];
 
   for (let row = 0; row <= boardSize - 5; row++) {
     for (let col = 0; col < boardSize; col++) {
       const pattern: number[][] = [];
       for (let i = 0; i < 5; i++) {
         pattern.push([row + i, col]);
       }
       patterns.push(pattern);
     }
   }
 
   return patterns;
 }
 
 // Helper function to generate all possible diagonal winning patterns (both directions)
  generateDiagonalWinningPatterns(boardSize: number): number[][][] {
   const patterns: number[][][] = [];
 
   for (let row = 0; row <= boardSize - 5; row++) {
     for (let col = 0; col <= boardSize - 5; col++) {
       const pattern1: number[][] = [];
       const pattern2: number[][] = [];
       for (let i = 0; i < 5; i++) {
         pattern1.push([row + i, col + i]);
         pattern2.push([row + i, col + 4 - i]);
       }
       patterns.push(pattern1, pattern2);
     }
   }
 
   return patterns;
 }
 
 // Combine all winning patterns into one array
  allWinningPatterns: number[][][] = [
   ...this.generateHorizontalWinningPatterns(this.boardSize),
   ...this.generateVerticalWinningPatterns(this.boardSize),
   ...this.generateDiagonalWinningPatterns(this.boardSize),
 ];
 
 
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
