import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {


  
  private WIN_SCORE: number = 100000000;
  private evaluationCount: { count: number };

  constructor() {
    this.evaluationCount = { count: 0 };
  }

  evaluate(board: string[][]): number {
    // Define the score values for different game states
    const winScore = 10000;
    const loseScore = -10000;
    const tieScore = 0;
    const blockingScore = 100;
  
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

  // evaluateBoardForWhite(board: string[][], blacksTurn: boolean): number {
  //   this.evaluationCount.count++;

  //   // Get board score of both players.
  //   let blackScore = this.getScore(board, true, blacksTurn);
  //   let whiteScore = this.getScore(board, false, blacksTurn);

  //   if (blackScore === 0) {
  //     blackScore = 1.0;
  //   }

  //   // Calculate relative score of white against black
  //   return whiteScore / blackScore;
  // }

  // private getScore(board: string[][], forBlack: boolean, blacksTurn: boolean): number {
  //   // Read the board
  //   const boardMatrix = board; // Assuming board is already a 2D array of strings.

  //   // Calculate the score for each of the 3 directions
  //   return (
  //     this.evaluateHorizontal(boardMatrix, forBlack, blacksTurn) +
  //     this.evaluateVertical(boardMatrix, forBlack, blacksTurn) +
  //     this.evaluateDiagonal(boardMatrix, forBlack, blacksTurn)
  //   );
  // }
  // evaluateHorizontal(boardMatrix: string[][], forBlack: boolean, playersTurn: boolean): number {
  //   const evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

  //   for (let i = 0; i < boardMatrix.length; i++) {
  //     for (let j = 0; j < boardMatrix[0].length; j++) {
  //       this.evaluateDirections(boardMatrix, i, j, forBlack, playersTurn, evaluations);
  //     }
  //     this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
  //   }

  //   return evaluations[2];
  // }

  // evaluateVertical(boardMatrix: string[][], forBlack: boolean, playersTurn: boolean): number {
  //   const evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

  //   for (let j = 0; j < boardMatrix[0].length; j++) {
  //     for (let i = 0; i < boardMatrix.length; i++) {
  //       this.evaluateDirections(boardMatrix, i, j, forBlack, playersTurn, evaluations);
  //     }
  //     this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
  //   }

  //   return evaluations[2];
  // }

  // evaluateDiagonal(boardMatrix: string[][], forBlack: boolean, playersTurn: boolean): number {
  //   const evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

  //   // From bottom-left to top-right diagonally
  //   for (let k = 0; k <= 2 * (boardMatrix.length - 1); k++) {
  //     const iStart = Math.max(0, k - boardMatrix.length + 1);
  //     const iEnd = Math.min(boardMatrix.length - 1, k);
  //     for (let i = iStart; i <= iEnd; ++i) {
  //       this.evaluateDirections(boardMatrix, i, k - i, forBlack, playersTurn, evaluations);
  //     }
  //     this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
  //   }

  //   // From top-left to bottom-right diagonally
  //   for (let k = 1 - boardMatrix.length; k < boardMatrix.length; k++) {
  //     const iStart = Math.max(0, k);
  //     const iEnd = Math.min(boardMatrix.length + k - 1, boardMatrix.length - 1);
  //     for (let i = iStart; i <= iEnd; ++i) {
  //       this.evaluateDirections(boardMatrix, i, i - k, forBlack, playersTurn, evaluations);
  //     }
  //     this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
  //   }

  //   return evaluations[2];
  // }
  // evaluateDirections(board: string[][], i: number, j: number, isBot: boolean, botsTurn: boolean, evals: number[]): void {
  //   // Check if the selected player has a stone in the current cell
  //   if (board[i][j] === (isBot ? 'O' : 'X')) {
  //     // Increment consecutive stones count
  //     evals[0]++;
  //   }
  //   // Check if cell is empty
  //   else if (board[i][j] === '_') {
  //     // Check if there were any consecutive stones before this empty cell
  //     if (evals[0] > 0) {
  //       // Consecutive set is not blocked by the opponent, decrement block count
  //       evals[1]--;
  //       // Get consecutive set score
  //       evals[2] += this.getConsecutiveSetScore(board, i, j);
  //       // Reset consecutive stone count
  //       evals[0] = 0;
  //       // Current cell is empty, next consecutive set will have at most 1 blocked side.
  //     }
  //     // No consecutive stones.
  //     // Current cell is empty, next consecutive set will have at most 1 blocked side.
  //     evals[1] = 1;
  //   }
  //   // Cell is occupied by the opponent
  //   // Check if there were any consecutive stones before this empty cell
  //   else if (evals[0] > 0) {
  //     // Get consecutive set score
  //     evals[2] += this.getConsecutiveSetScore(board, i, j);
  //     // Reset consecutive stone count
  //     evals[0] = 0;
  //     // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
  //     evals[1] = 2;
  //   } else {
  //     // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
  //     evals[1] = 2;
  //   }
  // }

  // evaluateDirectionsAfterOnePass(evals: number[], isBot: boolean, playersTurn: boolean): void {
  //   // End of row, check if there were any consecutive stones before we reached the right border
    
    
  //   // Reset consecutive stone and blocks count
  //   evals[0] = 0;
  //   evals[1] = 2;
  // }
  // getConsecutiveSetScore(board: string[][], row: number, col: number): number {
  //   const winGuarantee = 1000000;
  //   const playerStone = board[row][col];
  //   const boardSize = board.length;
  
  //   // Helper function to check if a cell is within the board boundaries
  //   function isValidCell(r: number, c: number): boolean {
  //     return r >= 0 && r < boardSize && c >= 0 && c < boardSize;
  //   }
  
  //   // Check if both sides of a set are blocked
  //   function isSetBlocked(r1: number, c1: number, r2: number, c2: number): boolean {
  //     return (
  //       (!isValidCell(r1, c1) || board[r1][c1] !== playerStone) &&
  //       (!isValidCell(r2, c2) || board[r2][c2] !== playerStone)
  //     );
  //   }
  
  //   // Count consecutive stones in a given direction
  //   function countConsecutiveStonesInDirection(dr: number, dc: number): number {
  //     let count = 0;
  //     let r = row + dr;
  //     let c = col + dc;
  
  //     while (isValidCell(r, c) && board[r][c] === playerStone) {
  //       count++;
  //       r += dr;
  //       c += dc;
  //     }
  
  //     return count;
  //   }
  
  //   // Check both directions (left and right) for blocking
  //   const leftBlocked = isSetBlocked(row, col - 1, row, col - 2);
  //   const rightBlocked = isSetBlocked(row, col + 1, row, col + 2);
  
  //   // Calculate consecutive counts in both directions
  //   const leftConsecutive = countConsecutiveStonesInDirection(0, -1);
  //   const rightConsecutive = countConsecutiveStonesInDirection(0, 1);
  
  //   // Total consecutive count
  //   const totalCount = leftConsecutive + rightConsecutive + 1; // Include the current stone
  
  //   switch (totalCount) {
  //     case 5: {
  //       // 5 consecutive wins the game
  //       return winGuarantee;
  //     }
  //     case 4: {
  //       // 4 consecutive stones in the player's turn guarantees a win.
  //       // (Player can win the game by placing the 5th stone after the set)
  //       if (playerStone === 'O') {
  //         return winGuarantee;
  //       } else {
  //         // Opponent's turn
  //         // If neither side is blocked, 4 consecutive stones guarantee a win in the next turn.
  //         // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
  //         // in the next turn). So a relatively high score is given for this set.
  //         if (!leftBlocked && !rightBlocked) {
  //           return winGuarantee / 4;
  //         }
  //         // If only a single side is blocked, 4 consecutive stones limit the opponent's move
  //         // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
  //         // in the next turn). So a relatively high score is given for this set.
  //         else {
  //           return 200;
  //         }
  //       }
  //     }
  //     case 3: {
  //       // 3 consecutive stones
  //       if (!leftBlocked && !rightBlocked) {
  //         // Neither side is blocked.
  //         // If it's the current player's turn, a win is guaranteed in the next 2 turns.
  //         // (Player places another stone to make the set 4 consecutive; opponent can only block one side)
  //         // However, the opponent may win the game in the next turn; therefore, this score is lower than win
  //         // guaranteed scores but still a very high score.
  //         if (playerStone === 'O') {
  //           return 50000;
  //         }
  //         // If it's the opponent's turn, this set forces the opponent to block one of the sides of the set.
  //         // So a relatively high score is given for this set.
  //         else {
  //           return 200;
  //         }
  //       } else {
  //         // One of the sides is blocked.
  //         // Playmaker scores
  //         if (playerStone === 'O') {
  //           return 10;
  //         } else {
  //           return 5;
  //         }
  //       }
  //     }
  //     case 2: {
  //       // 2 consecutive stones
  //       // Playmaker scores
  //       if (!leftBlocked && !rightBlocked) {
  //         if (playerStone === 'O') {
  //           return 7;
  //         } else {
  //           return 5;
  //         }
  //       } else {
  //         return 3;
  //       }
  //     }
  //     case 1: {
  //       return 1;
  //     }
  //   }
  
  //   // More than 5 consecutive stones?
  //   return winGuarantee * 2;
  // }


}
