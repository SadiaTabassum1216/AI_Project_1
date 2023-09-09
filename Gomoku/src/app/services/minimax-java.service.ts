import { Injectable } from '@angular/core';
import { MovesService } from './moves.service';
import { EvaluationJavaService } from './evaluation-java.service';

@Injectable({
  providedIn: 'root'
})
export class MinimaxJavaService {

  constructor(
    private evaluation_java: EvaluationJavaService,
    private moves: MovesService) { }

  maxDepth: number = 3;
  private WIN_SCORE: number = 10000000;

  calculateComputerMove(board: number[][]): [number, number] | null {

    const move: [number, number] = [-1, -1];

    const bestMove: { score: number; move: [number, number] } | null = this.searchWinningMove(board);

    if (bestMove !== null) {
      // Finishing move is found.
      move[0] = bestMove.move[0];
      move[1] = bestMove.move[1];
    } else {
      const minimaxResult: { score: number; move: [number, number] } = this.minimaxSearchAB(board, this.maxDepth, true, -1.0, this.WIN_SCORE);
      if (minimaxResult.move[0] === -1 || minimaxResult.move[1] === -1) {
        return null;
      } else {
        move[0] = minimaxResult.move[0];
        move[1] = minimaxResult.move[1];
      }
    }
    return move;

  }

  private minimaxSearchAB(
    board: number[][],
    depth: number,
    max: boolean,
    alpha: number,
    beta: number
  ): { score: number; move: [number, number] } {
    if (depth === 0) {
      const score = this.evaluation_java.evaluateRelativeScoreForComputer(board, !max);
      // console.log(`Depth: 0, Score: ${score}, Alpha: ${alpha}, Beta: ${beta}`);
      return { score: score, move: [-1, -1] };
    }

    const allPossibleMoves: number[][] = this.moves.generateMoves(board);

    if (allPossibleMoves.length === 0) {
      const score = this.evaluation_java.evaluateRelativeScoreForComputer(board, !max);
      return { score: score, move: [-1, -1] };

    }

    let bestMove: { score: number; move: [number, number] } = {
      score: max ? -1.0 : 10000000,
      move: [-1, -1],
    };
    if (max) {

      for (const move of allPossibleMoves) {
        bestMove.score = -1;
        const tempMove = this.minimaxSearchAB(board, depth - 1, false, alpha, beta);


        if (tempMove.score > alpha) {
          alpha = tempMove.score;
        }

        if (tempMove.score >= beta) {
          // console.log(`Depth: ${depth}, Pruned, Score: ${tempMove.score}, Alpha: ${alpha}, Beta: ${beta}`);
          return tempMove;
        }
        if (tempMove.score > bestMove.score) {
          bestMove = {
            score: tempMove.score,
            move: [move[0], move[1]],
          };
        }
        // console.log(`Depth: ${depth}, Score: ${tempMove.score}, Alpha: ${alpha}, Beta: ${beta}`);
      }
    } else {

      bestMove = {
        score: 10000000,
        move: [allPossibleMoves[0][0], allPossibleMoves[0][1]],
      };

      // Iterate for all possible moves that can be made.
      for (const move of allPossibleMoves) {

        const tempMove = this.minimaxSearchAB(board, depth - 1, true, alpha, beta);


        if (tempMove.score < beta) {
          beta = tempMove.score;
        }

        if (tempMove.score <= alpha) {
          // console.log(`Depth: ${depth}, Pruned, Score: ${tempMove.score}, Alpha: ${alpha}, Beta: ${beta}`);
          return tempMove;
        }

        if (tempMove.score < bestMove.score) {
          bestMove = {
            score: tempMove.score,
            move: [move[0], move[1]],
          };
        }
        // console.log(`Depth: ${depth}, Score: ${tempMove.score}, Alpha: ${alpha}, Beta: ${beta}`);
      }
    }

    return bestMove;
  }

  searchWinningMove(board: number[][]): { score: number; move: [number, number] } | null {
    const WIN_SCORE = 100000; // Define your WIN_SCORE constant here
    const allPossibleMoves: [number, number][] = this.moves.generateMoves(board);

    for (const move of allPossibleMoves) {
      if (this.evaluation_java.evaluate(board, false, false) >= WIN_SCORE) {
        return { score: WIN_SCORE, move: [move[0], move[1]] };
      }
    }
    return null;
  }

}
