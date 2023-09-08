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

  calculateComputerMove(board: string[][]): [number, number] | null {
    const bestMove = this.minimax(board, 0, true, -Infinity, Infinity);
    console.log("Best Move score: " + bestMove.score);
    console.log("Best Move: " + bestMove.move);
    return bestMove.move;
  }

  minimax(board: string[][],depth: number, maximizingPlayer: boolean, alpha: number, beta: number): 
  { score: number; move: [number, number] } {
    const result = this.checkGameStatus(board);
    if (result !== null || depth >= this.maxDepth) {
      return { score: this.evaluation.evaluate(board, maximizingPlayer), move: [-1, -1] };
    }

    let bestMove: [number, number] = [-1, -1];
    let bestScore: number = maximizingPlayer ? -Infinity : Infinity;

    const validMoves: [number, number][] = this.moves.generateMoves(board);

    for (const [row, col] of validMoves) {
      board[row][col] = maximizingPlayer ? 'O' : 'X'; // Make a move
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

  
  checkGameStatus(board: string[][]): string | null {
    if (this.checkWinningState(board, 'O')) {
      return 'O';
    }

    if (this.checkWinningState(board, 'X')) {
      return 'X';
    }

    if (this.isBoardFull(board)) {
      return 'Tie';
    }

    return null;
  }


  boardSize = 10;
  allWinningPatterns: number[][][] = this.generateWinningPatterns(this.boardSize);


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
