import { Injectable } from '@angular/core';
import { EvaluationService } from './evaluation.service';
import { MovesService } from './moves.service';
import { CheckBoardService } from './check-board.service';
import { Evaluation2Service } from './evaluation-2.service';

@Injectable({
  providedIn: 'root'
})
export class MinimaxService {

  constructor(
    private evaluation: EvaluationService,
    private moves: MovesService,
    private check: CheckBoardService) { }

  maxDepth: number = 3;
  private WIN_SCORE: number = 10000000;

  calculateComputerMove(board: string[][]): [number, number] | null {
    
    const move: [number, number] = [-1, -1];

    const bestMove: [number | null, number | null, number | null] | null = this.searchWinningMove(board);

    if (bestMove !== null) {
        // Finishing move is found.
        move[0] = bestMove[1]!;
        move[1] = bestMove[2]!;
    } else {
      const minimaxResult: { score: number; move: [number, number] } = this.minimaxSearchAB(board, this.maxDepth, true, -1.0, this.WIN_SCORE);
      if (minimaxResult.move === null) {
          return null;
      } else {
          move[0] = minimaxResult.move[0];
          move[1] = minimaxResult.move[1];
      }
    }
    

    return move;
    
    // const bestMove = this.minimax(board, this.maxDepth, true, -Infinity, Infinity);
    // console.log("Best Move score: " + bestMove.score);
    // console.log("Best Move: " + bestMove.move);
    // return bestMove.move;
  }

  private minimaxSearchAB(
    board: string[][],
    depth: number,
    max: boolean,
    alpha: number,
    beta: number
  ): { score: number; move: [number, number] } {
    if (depth === 0) {
      return { score: this.evaluation.evaluateRelativeScoreForComputer(board, !max), move: [-1, -1] };
    }
  
    const allPossibleMoves: number[][] =this.moves.generateMoves(board);

    if (allPossibleMoves.length === 0) {
      return { score: this.evaluation.evaluateRelativeScoreForComputer(board, !max), move: [-1, -1] };
     
    }
  
    let bestMove: { score: number; move: [number, number] } = {
      score: max ? -1.0 : 10000000,
      move: [-1, -1],
    };
    if (max) {
    
      for (const move of allPossibleMoves) {  
        bestMove.score=-1;   
        const tempMove = this.minimaxSearchAB( board,depth - 1, false, alpha, beta);
  
       
        if (tempMove.score > alpha) {
          alpha = tempMove.score;
        }
      
        if (tempMove.score >= beta) {
          return tempMove;
        }
        if (tempMove.score > bestMove.score) {
          bestMove = {
            score: tempMove.score,
            move: [move[0], move[1]],
          };
        }
      }
    } else {
     
      bestMove = {
        score: 10000000,
        move: [allPossibleMoves[0][0], allPossibleMoves[0][1]],
      };
  
      // Iterate for all possible moves that can be made.
      for (const move of allPossibleMoves) {
       
        const tempMove = this.minimaxSearchAB( board,depth - 1, true, alpha, beta);
  
      
        if (tempMove.score < beta) {
          beta = tempMove.score;
        }
        
        if (tempMove.score <= alpha) {
          return tempMove;
        }
  
        if (tempMove.score < bestMove.score) {
          bestMove = {
            score: tempMove.score,
            move: [move[0], move[1]],
          };
        }
      }
    }
  
    return bestMove;
  }
  

  // minimax(
  //   board: string[][],
  //   depth: number,
  //   maximizingPlayer: boolean,
  //   alpha: number,
  //   beta: number
  // ): { score: number; move: [number, number] } {
  //   const result = this.check.checkGameStatus(board);
  
  //   if (result !== null || depth <= 0) {
  //     return {
  //       score: this.evaluation.evaluateRelativeScoreForComputer(board, !maximizingPlayer),
  //       move: [-1, -1],
  //     };
  //   }
  
  //   let bestMove: [number, number] = [-1, -1];
  //   let bestScore: number = maximizingPlayer ? -Infinity : Infinity;
  
  //   const validMoves: [number, number][] = this.moves.generateMoves(board);
  
  //   for (const [row, col] of validMoves) {
  //     board[row][col] = maximizingPlayer ? 'O' : 'X'; // Make a move
  //     const score = this.minimax(board, depth - 1, false, alpha, beta).score;
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
  




 searchWinningMove(board: string[][]): [number | null, number | null, number | null] | null {
  const WIN_SCORE = 100000; // Define your WIN_SCORE constant here
  const allPossibleMoves: [number, number][] = this.moves.generateMoves(board);
  const winningMove: [number | null, number | null, number | null] = [null, null, null];

  for (const move of allPossibleMoves) {
    
    if (this.evaluation.evaluate(board, false, false) >= WIN_SCORE) {
      winningMove[1] = move[0];
      winningMove[2] = move[1];
      return winningMove;
    }
  }
  return null;
}
  
}
