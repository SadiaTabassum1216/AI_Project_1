import { Injectable } from '@angular/core';
import { MovesService } from './moves.service';
import { CheckBoardService } from './check-board.service';
import { Evaluation2Service } from './evaluation_new.service';

@Injectable({
  providedIn: 'root'
})
export class Minimax2Service {

  constructor(
  
    private evaluation_new: Evaluation2Service,
    private moves: MovesService,
    private check: CheckBoardService) { }

  maxDepth: number = 3;

  calculateComputerMove(board: string[][]): [number, number] | null {
    const validMoves: [number, number][] = this.moves.generateMoves(board);
    const firstMove: [number, number] = validMoves[0];
    const bestMove = this.minimax(board, this.maxDepth, true, -Infinity, Infinity, firstMove);
    console.log("Best Move score: " + bestMove.score);
    console.log("Best Move: " + bestMove.move);
    return bestMove.move;
  }

  minimax(
    board: string[][],
    depth: number,
    maximizingPlayer: boolean,
    alpha: number,
    beta: number,
    move: [number, number] 
  ): { score: number; move: [number, number] } {
    const result = this.check.checkGameStatus(board);
  
    if (result !== null || depth <= 0) {
      return { score: this.evaluation_new.evaluate(board, maximizingPlayer, move), move: [-1, -1] };
    }
  
    let bestMove: [number, number] = move; // Initialize bestMove with the provided move
    let bestScore: number = maximizingPlayer ? -Infinity : Infinity;
  
    const validMoves: [number, number][] = this.moves.generateMoves(board);
  
    for (const [row, col] of validMoves) {
      board[row][col] = maximizingPlayer ? 'O' : 'X'; // Make a move
      const score = this.minimax(board, depth - 1, !maximizingPlayer, alpha, beta, [row, col]).score; // Pass the move
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
  


}
