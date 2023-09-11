import { Injectable } from '@angular/core';
import { Cell_evaluation } from '../models/cell_eval.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {


  private WIN_SCORE: number = 10_000_000;
  constructor() {
  }

  evaluateRelativeScoreForComputer(board: number[][], isHuman: boolean): number {
    // Calculate the score for the computer (black) and human (white)
    let computerScore = this.evaluate(board, false, isHuman);
    let humanScore = this.evaluate(board, true, isHuman);

    if (humanScore === 0) {
      humanScore = 1.0;
    }

    const relativeScore = computerScore / humanScore;

    return relativeScore;
  }


  evaluate(board: number[][], forHuman: boolean, maximizingPlayer: boolean): number {
    let totalScore = 0;

    totalScore = this.evaluateHorizontal(board, forHuman, maximizingPlayer) +
      this.evaluateVertical(board, forHuman, maximizingPlayer) +
      this.evaluateDiagonal(board, forHuman, maximizingPlayer);

    return totalScore;

  }

  private evaluateHorizontal(board: number[][], forHuman: boolean, maximizingPlayer: boolean): number {
    let evaluation = new Cell_evaluation();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        this.evaluateDirections(board, i, j, forHuman, maximizingPlayer, evaluation);
      }
      this.evaluateDirectionsAfterOnePass(evaluation, forHuman, maximizingPlayer);

    }

    return evaluation.score;
  }


  private evaluateVertical(board: number[][], forHuman: boolean, maximizingPlayer: boolean): number {
    let evaluation = new Cell_evaluation();

    for (let j = 0; j < board[0].length; j++) {
      for (let i = 0; i < board.length; i++) {
        this.evaluateDirections(board, i, j, forHuman, maximizingPlayer, evaluation);
      }
      this.evaluateDirectionsAfterOnePass(evaluation, forHuman, maximizingPlayer);
    }

    return evaluation.score;
  }

  private evaluateDiagonal(board: number[][], forHuman: boolean, maximizingPlayer: boolean): number {
    let evaluation = new Cell_evaluation();

    // From bottom-left to top-right diagonally
    for (let k = 0; k <= 2 * (board.length - 1); k++) {
      const iStart = Math.max(0, k - board.length + 1);
      const iEnd = Math.min(board.length - 1, k);
      for (let i = iStart; i <= iEnd; ++i) {
        this.evaluateDirections(board, i, k - i, forHuman, maximizingPlayer, evaluation);
      }
      this.evaluateDirectionsAfterOnePass(evaluation, forHuman, maximizingPlayer);
    }

    // From top-left to bottom-right diagonally
    for (let k = 1 - board.length; k < board.length; k++) {
      const iStart = Math.max(0, k);
      const iEnd = Math.min(board.length + k - 1, board.length - 1);
      for (let i = iStart; i <= iEnd; ++i) {
        this.evaluateDirections(board, i, i - k, forHuman, maximizingPlayer, evaluation);
      }
      this.evaluateDirectionsAfterOnePass(evaluation, forHuman, maximizingPlayer);
    }

    return evaluation.score;
  }

  private evaluateDirections(board: number[][], i: number, j: number, isHuman: boolean, AITurn: boolean, evals: Cell_evaluation): Cell_evaluation {
    if (board[i][j] === (isHuman ? 2 : 1)) {
      evals.consecutiveCount++;
    }

    else if (board[i][j] === 0) {
      if (evals.consecutiveCount > 0) {
        evals.blockCount--;
        evals.score += this.getConsecutiveSetScore(evals.consecutiveCount, evals.blockCount, isHuman === AITurn);
        evals.consecutiveCount = 0;
      }

      evals.blockCount = 1;
    }
    else if (evals.consecutiveCount > 0) {
      evals.score += this.getConsecutiveSetScore(evals.consecutiveCount, evals.blockCount, isHuman === AITurn);
      evals.consecutiveCount = 0;
      evals.blockCount = 2;
    } else {
      evals.blockCount = 2;
    }
    return evals;
  }

  private evaluateDirectionsAfterOnePass(evals: Cell_evaluation, isAI: boolean, humanTurn: boolean): Cell_evaluation {
    if (evals.consecutiveCount > 0) {
      evals.score += this.getConsecutiveSetScore(evals.consecutiveCount, evals.blockCount, isAI === humanTurn);
    }
    evals.consecutiveCount = 0;
    evals.blockCount = 2;

    return evals;
  }

  private getConsecutiveSetScore(count: number, blocks: number, currentTurn: boolean): number {
    let winGuarantee = 1000000;

    if (blocks === 2 && count < 5) {
      return 0;
    }

    switch (count) {
      case 5:
        return this.WIN_SCORE;
      case 4:
        if (!currentTurn) return winGuarantee;
        else {
          if (blocks === 0) return winGuarantee / 4;
          else return 200;
        }
      case 3:
        if (blocks === 0) {
          if (currentTurn) return 50000;
          else return 200;
        } else {
          if (currentTurn) return 10;
          else return 5;
        }
      case 2:
        if (blocks === 0) {
          if (currentTurn) return 7;
          else return 5;
        } else {
          return 3;
        }
      case 1:
        return 1;
      default:
        return this.WIN_SCORE * 2;
    }

  }

}