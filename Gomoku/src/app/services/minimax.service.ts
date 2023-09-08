import { Injectable } from '@angular/core';
import { EvaluationService } from './evaluation.service';
import { MovesService } from './moves.service';

@Injectable({
  providedIn: 'root'
})
export class MinimaxService {

  constructor(private evaluation: EvaluationService,
    private moves: MovesService) { }

  maxDepth: number = 3;

  // Function to find the best move for the computer player ('O')
  calculateComputerMove(board: string[][]): [number, number] | null {
    const bestMove = this.minimax(board, 0, true, -Infinity, Infinity);
    console.log("Best Move score: " + bestMove.score);
    console.log("Best Move: " + bestMove.move);
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
    if (result !== null || depth >= this.maxDepth) {
      return { score: this.evaluation.evaluate(board, maximizingPlayer), move: [-1, -1] };
    }

    let bestMove: [number, number] = [-1, -1];
    let bestScore: number = maximizingPlayer ? -Infinity : Infinity;

    const validMoves: [number, number][] = this.moves.generateMoves(board);


    for (const [row, col] of validMoves) {
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

      if (alpha >= beta) {
        break; // Prune the branch
      }
    }
  
    return { score: bestScore, move: bestMove };
  }

  // Check if the game is over and return the result
  checkGameStatus(board: string[][]): string | null {
    // Check for a winning state for 'O'
    if (this.evaluation.checkWinningState(board, 'O')) {
      return 'O';
    }

    // Check for a winning state for 'X'
    if (this.evaluation.checkWinningState(board, 'X')) {
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
