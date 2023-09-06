import { Injectable } from '@angular/core';
import { EvaluationService } from './evaluation.service';

@Injectable({
  providedIn: 'root'
})
export class MinimaxService {

  constructor(private pruning: EvaluationService) { }
  
  maxdepth: number=4;

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
      return { score: this.pruning.evaluate(board), move: [-1, -1] };
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

          if(alpha >= beta){
            break; // Prune the branch
          }
        }
      }
    }

    return { score: bestScore, move: bestMove };
  }

  
  // Check if the game is over and return the result
  checkGameStatus(board: string[][]): string | null {
    // Check for a winning state for 'O'
    if (this.pruning.checkWinningState(board, 'O')) {
      return 'O';
    }
  
    // Check for a winning state for 'X'
    if (this.pruning.checkWinningState(board, 'X')) {
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
