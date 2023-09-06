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
    const blockingScore = 100;
  
    const player = 'O'; // Assuming the computer plays as 'O' in your game
  
    // Define the scoring patterns and their corresponding scores
    const scoringPatterns: { [pattern: string]: number } = {
      '11110': 1000,  // Five in a row with one empty end
      '011110': 500, // Four in a row with one empty end
      '01110': 50,   // Four in a row with no empty end
      '001110': 25,  // Three in a row with one empty end
      '011100': 25,  // Three in a row with one empty end
      '0001110': 5,  // Two in a row with one empty end
      '011000': 5,   // Two in a row with one empty end
      '001100': 2,   // Two in a row with no empty end
      '000110': 2,   // Two in a row with no empty end
    };
  
    // Your existing code for generating winning patterns
    // ...
  
    // Helper function to calculate the score for a pattern
    function calculatePatternScore(pattern: string, currentPlayer: string): number {
      const reversedPattern = pattern.split('').reverse().join('');
      if (scoringPatterns[pattern]) {
        return currentPlayer === player ? scoringPatterns[pattern] : -scoringPatterns[pattern];
      } else if (scoringPatterns[reversedPattern]) {
        return currentPlayer === player ? scoringPatterns[reversedPattern] : -scoringPatterns[reversedPattern];
      }
      return 0;
    }
  
    // Calculate the score for the entire board
    let score = 0;
    for (const pattern of this.allWinningPatterns) {
      const patternString = pattern.map(([row, col]) => board[row][col]).join('');
      score += calculatePatternScore(patternString, player);
    }
  
    // Add your additional scoring logic here, such as consecutive sets
  
    // Check for a winning state for 'O'
    if (this.checkWinningState(board, 'O')) {
      return winScore;
    }
  
    // Check for a winning state for 'X'
    if (this.checkWinningState(board, 'X')) {
      return loseScore;
    }
  
    // If neither 'O' nor 'X' has won, return the computed score
    return score;
  }
  
  // evaluate(board: string[][]): number {
  //   // Define the score values for different game states
  //   const winScore = 10000;
  //   const loseScore = -10000;
  //   const tieScore = 0;
  //   const blockingScore = 100;
  
  //   // Convert the board to a string for pattern matching
  //   const boardString = board.map(row => row.join('')).join('');
  
  //   // Check for a winning state for 'O'
  //   if (this.checkWinningState(board, 'O')) {
  //     return winScore;
  //   }
  
  //   // Check for a winning state for 'X'
  //   if (this.checkWinningState(board, 'X')) {
  //     return loseScore;
  //   }
  
  //   // Define blocking patterns (patterns where a player is close to winning)
  //   const blockingPatterns = ['XXXX_', 'XXX_X', 'XX_XX', 'X_XXX', 'XXXXX', 'X_XXX', 'XX_XX', 'XXX_X', '_XXXX', 'X___X'];
  
  //   // Define opponent's winning patterns
  //   const opponentWinningPatterns = ['OOOO_', 'OOO_O', 'OO_OO', 'O_OOO'];
  
  //   // Check for blocking patterns
  //   for (const pattern of blockingPatterns) {
  //     if (boardString.includes(pattern)) {
  //       return blockingScore;
  //     }
  //   }
  
  //   // Check for opponent's winning patterns
  //   for (const pattern of opponentWinningPatterns) {
  //     if (boardString.includes(pattern)) {
  //       return -blockingScore;
  //     }
  //   }
  
  //   // If neither 'O' nor 'X' has won or blocked, return a tie score
  //   return tieScore;
  // }
  
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

// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class PruningService {

//   constructor() { }

//   // Evaluate the board
//   evaluate(board: string[][]): number {
//     // Define the score values for different game states
//     const winScore = 10000;
//     const loseScore = -10000;
//     const tieScore = 0;
  
//     // Check for a winning state for 'O'
//     if (this.checkWinningState(board, 'O')) {
//       return winScore;
//     }
  
//     // Check for a winning state for 'X'
//     if (this.checkWinningState(board, 'X')) {
//       return loseScore;
//     }
  
//     // If neither 'O' nor 'X' has won, return a tie score
//     return tieScore;
//   }

// // Define scoring patterns and their corresponding scores
// //  scoringPatterns: { [pattern: string]: number } = {
// //   '11110': 1000,  // Five Xs in a row with one empty end
// //   '011110': 500, // Four Xs in a row with one empty end
// //   '01110': 50,   // Four Xs in a row with no empty end
// //   '001110': 25,  // Three Xs in a row with one empty end
// //   '011100': 25,  // Three Xs in a row with one empty end
// //   '0001110': 5,  // Two Xs in a row with one empty end
// //   '011000': 5,   // Two Xs in a row with one empty end
// //   '001100': 2,   // Two Xs in a row with no empty end
// //   '000110': 2,   // Two Xs in a row with no empty end
// // };

// //  evaluate(board: string[][]): number {
// //   let score = 0;
// //   const player= 'O';

// //   // Define the dimensions of the game board
// //   const boardSize = board.length;

// //   // Check horizontal patterns
// //   for (let row = 0; row < boardSize; row++) {
// //     for (let col = 0; col <= boardSize - 5; col++) {
// //       const pattern = board[row].slice(col, col + 5).join('');
// //       if (pattern.includes(player)) {
// //         for (const key in this.scoringPatterns) {
// //           if (pattern.includes(key)) {
// //             score += this.scoringPatterns[key];
// //           }
// //         }
// //       }
// //     }
// //   }

// //   // Check vertical patterns
// //   for (let col = 0; col < boardSize; col++) {
// //     for (let row = 0; row <= boardSize - 5; row++) {
// //       const pattern = [];
// //       for (let i = 0; i < 5; i++) {
// //         pattern.push(board[row + i][col]);
// //       }
// //       if (pattern.includes(player)) {
// //         for (const key in this.scoringPatterns) {
// //           if (pattern.join('').includes(key)) {
// //             score += this.scoringPatterns[key];
// //           }
// //         }
// //       }
// //     }
// //   }

// //   // Check diagonal patterns (top-left to bottom-right)
// //   for (let row = 0; row <= boardSize - 5; row++) {
// //     for (let col = 0; col <= boardSize - 5; col++) {
// //       const pattern = [];
// //       for (let i = 0; i < 5; i++) {
// //         pattern.push(board[row + i][col + i]);
// //       }
// //       if (pattern.includes(player)) {
// //         for (const key in this.scoringPatterns) {
// //           if (pattern.join('').includes(key)) {
// //             score += this.scoringPatterns[key];
// //           }
// //         }
// //       }
// //     }
// //   }

// //   // Check diagonal patterns (top-right to bottom-left)
// //   for (let row = 0; row <= boardSize - 5; row++) {
// //     for (let col = boardSize - 1; col >= 4; col--) {
// //       const pattern = [];
// //       for (let i = 0; i < 5; i++) {
// //         pattern.push(board[row + i][col - i]);
// //       }
// //       if (pattern.includes(player)) {
// //         for (const key in this.scoringPatterns) {
// //           if (pattern.join('').includes(key)) {
// //             score += this.scoringPatterns[key];
// //           }
// //         }
// //       }
// //     }
// //   }

// //   return score;
// // }

//  boardSize = 10;

//  // Helper function to generate all possible horizontal winning patterns
//   generateHorizontalWinningPatterns(boardSize: number): number[][][] {
//    const patterns: number[][][] = [];
 
//    for (let row = 0; row < boardSize; row++) {
//      for (let col = 0; col <= boardSize - 5; col++) {
//        const pattern: number[][] = [];
//        for (let i = 0; i < 5; i++) {
//          pattern.push([row, col + i]);
//        }
//        patterns.push(pattern);
//      }
//    }
 
//    return patterns;
//  }
 
//  // Helper function to generate all possible vertical winning patterns
//   generateVerticalWinningPatterns(boardSize: number): number[][][] {
//    const patterns: number[][][] = [];
 
//    for (let row = 0; row <= boardSize - 5; row++) {
//      for (let col = 0; col < boardSize; col++) {
//        const pattern: number[][] = [];
//        for (let i = 0; i < 5; i++) {
//          pattern.push([row + i, col]);
//        }
//        patterns.push(pattern);
//      }
//    }
 
//    return patterns;
//  }
 
//  // Helper function to generate all possible diagonal winning patterns (both directions)
//   generateDiagonalWinningPatterns(boardSize: number): number[][][] {
//    const patterns: number[][][] = [];
 
//    for (let row = 0; row <= boardSize - 5; row++) {
//      for (let col = 0; col <= boardSize - 5; col++) {
//        const pattern1: number[][] = [];
//        const pattern2: number[][] = [];
//        for (let i = 0; i < 5; i++) {
//          pattern1.push([row + i, col + i]);
//          pattern2.push([row + i, col + 4 - i]);
//        }
//        patterns.push(pattern1, pattern2);
//      }
//    }
 
//    return patterns;
//  }
 
//  // Combine all winning patterns into one array
//   allWinningPatterns: number[][][] = [
//    ...this.generateHorizontalWinningPatterns(this.boardSize),
//    ...this.generateVerticalWinningPatterns(this.boardSize),
//    ...this.generateDiagonalWinningPatterns(this.boardSize),
//  ];
 
 
//   // Helper function to check if a player has won
//   checkWinningState(board: string[][], player: string): boolean {
   
//     for (const pattern of this.allWinningPatterns) {
//       if (this.checkPattern(board, pattern, player)) {
//         return true;
//       }
//     }
  
//     return false;
//   }

  
  
//   // Helper function to check if a specific pattern is present on the board
//   checkPattern(board: string[][], pattern: number[][], player: string): boolean {
//     for (const [row, col] of pattern) {
//       if (board[row][col] !== player) {
//         return false;
//       }
//     }
//     return true;
//   }
  

 
// }
