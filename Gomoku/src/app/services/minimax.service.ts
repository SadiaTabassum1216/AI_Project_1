// import { Injectable } from '@angular/core';
// import { EvaluationService } from './evaluation.service';
// import { MovesService } from './moves.service';
// import { CheckBoardService } from './check-board.service';
// import { Evaluation2Service } from './evaluation_new.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class MinimaxService {

//   constructor(
//     private evaluation: EvaluationService,
//     private moves: MovesService,
//     private check: CheckBoardService) { }

//   maxDepth: number = 3;

//   calculateComputerMove(board: string[][]): [number, number] | null {
//     const bestMove = this.minimax(board, this.maxDepth, true, -Infinity, Infinity);
//     console.log("Best Move score: " + bestMove.score);
//     console.log("Best Move: " + bestMove.move);
//     return bestMove.move;
//   }

//   minimax(board: string[][], depth: number, maximizingPlayer: boolean, alpha: number, beta: number): 
//   { score: number; move: [number, number] } {
//   const result = this.check.checkGameStatus(board);

//   if (result !== null || depth <= 0) {
//     return { score: this.evaluation.evaluateRelativeScoreForComputer(board, maximizingPlayer), move: [-1, -1] };
//     // return { score: this.evaluation_2.evaluate(board, maximizingPlayer), move: [-1, -1] };
//   }

//   let bestMove: [number, number] = [-1, -1];
//   let bestScore: number = maximizingPlayer ? -Infinity : Infinity;

//   const validMoves: [number, number][] = this.moves.generateMoves(board);

//   for (const [row, col] of validMoves) {
//     board[row][col] = maximizingPlayer ? 'O' : 'X'; // Make a move
//     const score = this.minimax(board, depth - 1, !maximizingPlayer, alpha, beta).score; 
//     board[row][col] = ''; // Undo the move

//     if (maximizingPlayer && score > bestScore) {
//       bestScore = score;
//       bestMove = [row, col];
//       alpha = Math.max(alpha, bestScore);
//     } else if (!maximizingPlayer && score < bestScore) {
//       bestScore = score;
//       bestMove = [row, col];
//       beta = Math.min(beta, bestScore);
//     }

//     if (alpha >= beta) {
//       break; // Prune the branch
//     }
//   }

//   return { score: bestScore, move: bestMove };
// }

  
// }

import { Injectable } from '@angular/core';
import { EvaluationJavaService } from './evaluation-java.service';
import { MovesService } from './moves.service';
import { CheckBoardService } from './check-board.service';
import { Evaluation2Service } from './evaluation_new.service';

@Injectable({
  providedIn: 'root'
})
export class MinimaxService {

  constructor(
    private evaluation: EvaluationJavaService,
    private moves: MovesService,
    private check: CheckBoardService) { }

  maxDepth: number = 3;

  calculateComputerMove(board: number[][]): [number, number] | null {
    const bestMove = this.minimax(board, this.maxDepth, true, -Infinity, Infinity);
    console.log("Best Move score: " + bestMove.score);
    console.log("Best Move: " + bestMove.move);
    return bestMove.move;
  }

  minimax(board: number[][], depth: number, maximizingPlayer: boolean, alpha: number, beta: number): 
  { score: number; move: [number, number] } {
  const result = this.check.checkGameStatus(board);

  if (result !== null || depth <= 0) {
    return { score: this.evaluation.evaluateRelativeScoreForComputer(board, maximizingPlayer), move: [-1, -1] };
    // return { score: this.evaluation_2.evaluate(board, maximizingPlayer), move: [-1, -1] };
  }

  let bestMove: [number, number] = [-1, -1];
  let bestScore: number = maximizingPlayer ? -Infinity : Infinity;

  const validMoves: [number, number][] = this.moves.generateMoves(board);

  for (const [row, col] of validMoves) {
    board[row][col] = maximizingPlayer ? 1 : 2; // Make a move
    const score = this.minimax(board, depth - 1, !maximizingPlayer, alpha, beta).score; 
    board[row][col] = 0; // Undo the move

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
