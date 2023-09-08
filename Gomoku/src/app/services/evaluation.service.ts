import { Injectable } from '@angular/core';
import { CheckBoardService } from './check-board.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private WIN_SCORE: number = 100000000;
  playerStone: string = '';
  max_count: number=0;

  constructor() {
  }

  evaluateRelativeScoreForComputer(board: string[][], isAI: boolean): number {
    // Calculate the score for the computer (black) and human (white)
    let computerScore = this.evaluate(board, isAI);
    let humanScore = this.evaluate(board, !isAI);
  
    // If humanScore is 0, set it to 1 to avoid division by zero
    if (humanScore === 0) {
      humanScore = 1.0;
    }
  
    // Calculate the relative score of the computer (black) against the human (white)
    const relativeScore = computerScore / humanScore;
  
    return relativeScore;
  }
  

  evaluate(board: string[][], maximizingPlayer: boolean): number {
      this.playerStone = maximizingPlayer ? 'O' : 'X';

      let totalScore = 0;
     
      totalScore=this.evaluateHorizontal(board, this.playerStone) +
      this.evaluateVertical(board, this.playerStone) +
      this.evaluateDiagonal(board, this.playerStone);

      // console.log("Count: "+this.max_count);

    return totalScore;
      
  }

  private evaluateHorizontal(board: string[][], playerStone: string): number {
    let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
      this.evaluateDirections(board, i, j, playerStone, evaluations);
      }
    this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
    }

    return evaluations[2];
  }

  private evaluateVertical(board: string[][], playerStone: string): number {
    let evaluations = [0, 2, 0]; 

    for (let j = 0; j < board[0].length; j++) {
      for (let i = 0; i < board.length; i++) {
       this.evaluateDirections(board, i, j, playerStone, evaluations);
      }
     this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
    }

    return evaluations[2];
  }

  private evaluateDiagonal(board: string[][], playerStone: string): number {
    let evaluations = [0, 2, 0];
    // From bottom-left to top-right diagonally
    for (let k = 0; k <= 2 * (board.length - 1); k++) {
      const iStart = Math.max(0, k - board.length + 1);
      const iEnd = Math.min(board.length - 1, k);
      for (let i = iStart; i <= iEnd; ++i) {
       this.evaluateDirections(board, i, k - i, playerStone, evaluations);
      }
      this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
    }

    // From top-left to bottom-right diagonally
    for (let k = 1 - board.length; k < board.length; k++) {
      const iStart = Math.max(0, k);
      const iEnd = Math.min(board.length + k - 1, board.length - 1);
      for (let i = iStart; i <= iEnd; ++i) {
       this.evaluateDirections(board, i, i - k, playerStone, evaluations);
      }
     this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
    }

    return evaluations[2];
  }

  private evaluateDirections(board: string[][], i: number, j: number, playerStone: string, evals: number[]): void {
    if (board[i][j] === playerStone) {
      evals[0]++;
    }
 
    else if (board[i][j] === '') {
      // Check if there were any consecutive stones before this empty cell
      if (evals[0] > 0) {
        // Consecutive set is not blocked by the opponent, decrement block count
        evals[1]--;
        // Get consecutive set score
        evals[2] += this.getConsecutiveSetScore(evals[0], evals[1], playerStone);
        // Reset consecutive stone count
        evals[0] = 0;
        // Current cell is empty, next consecutive set will have at most 1 blocked side.
      }
      
      evals[1] = 1;
    }
    else if (evals[0] > 0) {
      // Get consecutive set score
      evals[2] += this.getConsecutiveSetScore(evals[0], evals[1], playerStone);
      // Reset consecutive stone count
      evals[0] = 0;
      // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
      evals[1] = 2;
    } else {
      // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
      evals[1] = 2;
    }
    // return evals;
  }

  private evaluateDirectionsAfterOnePass(evals: number[], playerStone: string): number[] {
    // End of row, check if there were any consecutive stones before we reached the right border
    if (evals[0] > 0) {
      evals[2] += this.getConsecutiveSetScore(evals[0], evals[1], playerStone);
    }
    // Reset consecutive stone and blocks count
    evals[0] = 0;
    evals[1] = 2;

    return evals;
  }

  private getConsecutiveSetScore(count: number, blocks: number, playerStone: string): number {
    let winGuarantee = this.WIN_SCORE;

    // If both sides of a set are blocked, this set is worthless, return 0 points.
    if (blocks === 2 && count < 5) {
      return 0;
    }
    console.log("count: "+ count);

    if(count>this.max_count)
    this.max_count=count;

    if (playerStone !== 'O') {
      winGuarantee = -winGuarantee;
    }

    switch (count) {
      case 5: return winGuarantee;
      case 4: return playerStone === 'X' ? winGuarantee : (blocks === 0 ? winGuarantee / 4 : 200);
      case 3: return blocks === 0 ? (playerStone === 'O' ? 50000 : 200) : (playerStone === 'O' ? 10 : 5);
      case 2: return blocks === 0 ? (playerStone === 'O' ? 7 : 5) : 3;
      case 1: return 1;
      default: return winGuarantee * 2;
    }
  }



  

}
