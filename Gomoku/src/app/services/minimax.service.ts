import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MinimaxService {

  constructor() { }
  
  maxdepth: number=3;

  
  // Function to find the best move for the computer player ('O')
  calculateComputerMove(board: string[][]): [number, number] | null {
    const bestMove = this.minimax(board, 0, false, -Infinity, Infinity);
    return bestMove.move;
  }

  // Minimax algorithm
  minimax(
    board: string[][],
    depth: number,
    maximizingPlayer: boolean,
    alpha: number,
    beta: number
  ): { score: number; move: [number, number] } {
    // Check if the game is over or the depth limit is reached
    const result = this.checkGameStatus(board);
    if (result !== null || depth >= this.maxdepth) {
      return { score: this.evaluate(board), move: [-1, -1] };
    }

    let bestMove: [number, number] = [-1, -1];
    let bestScore: number = maximizingPlayer ? -Infinity : Infinity;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === '') {
          // Try this empty cell
          board[row][col] = maximizingPlayer ? 'O' : 'X';
          const score = this.minimax(board, depth + 1, !maximizingPlayer, alpha, beta).score;
          board[row][col] = ''; // Undo the move

          if (maximizingPlayer && score > bestScore) {
            bestScore = score;
            bestMove = [row, col];
            alpha = Math.max(alpha, bestScore);
          } else if (!maximizingPlayer && score < bestScore) {
            bestScore = score;
            bestMove = [row, col];
            beta = Math.min(beta, bestScore);
          }

          if (beta <= alpha) {
            break; // Prune the branch
          }
        }
      }
    }

    return { score: bestScore, move: bestMove };
  }

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
  
  // Helper function to check if a player has won
  checkWinningState(board: string[][], player: string): boolean {
    const winningPatterns = [
      [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
      // Add more winning patterns for horizontal, vertical, and diagonal wins
    ];
  
    for (const pattern of winningPatterns) {
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
  
  // Check if the game is over and return the result
  checkGameStatus(board: string[][]): string | null {
    // Check for a winning state for 'O'
    if (this.checkWinningState(board, 'O')) {
      return 'O';
    }
  
    // Check for a winning state for 'X'
    if (this.checkWinningState(board, 'X')) {
      return 'X';
    }
  
    // Check for a tie (board is full)
    if (this.isBoardFull(board)) {
      return 'Tie';
    }
  
    // The game is still ongoing
    return null;
  }
  
  // Helper function to check if the board is full
  isBoardFull(board: string[][]): boolean {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === '') {
          return false;
        }
      }
    }
    return true;
  }
  
}
