import { Injectable } from '@angular/core';
import { Cell_evaluation } from '../models/cell_eval.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationJavaService {


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

  private evaluateDirections(board: number[][], i: number, j: number, isAI: boolean, AITurn: boolean, evals: Cell_evaluation): Cell_evaluation {
    if (board[i][j] === (isAI ? 2 : 1)) {
      evals.consecutiveCount++;
    }

    else if (board[i][j] === 0) {
      // Check if there were any consecutive stones before this empty cell
      if (evals.consecutiveCount > 0) {
        // Consecutive set is not blocked by the opponent, decrement block count
        evals.blockCount--;
        // Get consecutive set score
        evals.score += this.getConsecutiveSetScore(evals.consecutiveCount, evals.blockCount, isAI === AITurn);
        // Reset consecutive stone count
        evals.consecutiveCount = 0;
        // Current cell is empty, next consecutive set will have at most 1 blocked side.
      }

      evals.blockCount = 1;
    }
    else if (evals.consecutiveCount > 0) {
      // Get consecutive set score
      evals.score += this.getConsecutiveSetScore(evals.consecutiveCount, evals.blockCount, isAI === AITurn);
      // Reset consecutive stone count
      evals.consecutiveCount = 0;
      // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
      evals.blockCount = 2;
    } else {
      // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
      evals.blockCount = 2;
    }
    return evals;
  }

  private evaluateDirectionsAfterOnePass(evals: Cell_evaluation, isAI: boolean, humanTurn: boolean): Cell_evaluation {
    // End of row, check if there were any consecutive stones before we reached the right border
    if (evals.consecutiveCount > 0) {
      evals.score += this.getConsecutiveSetScore(evals.consecutiveCount, evals.blockCount, isAI === humanTurn);
    }
    // Reset consecutive stone and blocks count
    evals.consecutiveCount = 0;
    evals.blockCount = 2;

    return evals;
  }

  private getConsecutiveSetScore(count: number, blocks: number, currentTurn: boolean): number {
    let winGuarantee = 1000000;

    // If both sides of a set are blocked, this set is worthless, return 0 points.
    if (blocks === 2 && count < 5) {
      return 0;
    }

    switch (count) {
      case 5:
        // 5 consecutive wins the game
        return this.WIN_SCORE;
      case 4:
        // 4 consecutive stones in the user's turn guarantees a win.
        // (User can win the game by placing the 5th stone after the set)
        if (!currentTurn) return winGuarantee;
        else {
          // Opponent's turn
          // If neither side is blocked, 4 consecutive stones guarantees a win in the next turn.
          // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
          // in the next turn). So a relatively high score is given for this set.
          if (blocks === 0) return winGuarantee / 4;
          // If only a single side is blocked, 4 consecutive stones limits the opponent's move
          // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
          // in the next turn). So a relatively high score is given for this set.
          else return 200;
        }
      case 3:
        // 3 consecutive stones
        if (blocks === 0) {
          // Neither side is blocked.
          // If it's the current player's turn, a win is guaranteed in the next 2 turns.
          // (User places another stone to make the set 4 consecutive, opponent can only block one side)
          // However, the opponent may win the game in the next turn, therefore this score is lower than win
          // guaranteed scores but still a very high score.
          if (currentTurn) return 50_000;
          // If it's the opponent's turn, this set forces the opponent to block one of the sides of the set.
          // So a relatively high score is given for this set.
          else return 200;
        } else {
          // One of the sides is blocked.
          // Playmaker scores
          if (currentTurn) return 10;
          else return 5;
        }
      case 2:
        // 2 consecutive stones
        // Playmaker scores
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