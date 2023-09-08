import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private WIN_SCORE: number = 100000000;
  playerStone: string = '';

  constructor() {
  }

  evaluate(board: string[][], maximizingPlayer: boolean): number {
    if (maximizingPlayer)
      this.playerStone = 'O';
    else
      this.playerStone = 'X';

    return (
      this.evaluateHorizontal(board, this.playerStone) +
      this.evaluateVertical(board, this.playerStone) +
      this.evaluateDiagonal(board, this.playerStone)
    );
  }

  private evaluateHorizontal(board: string[][], playerStone: string): number {
    let evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
      evaluations=  this.evaluateDirections(board, i, j, playerStone, evaluations);
      }
     evaluations= this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
    }

    return evaluations[2];
  }

  private evaluateVertical(board: string[][], playerStone: string): number {
    let evaluations = [0, 2, 0]; 

    for (let j = 0; j < board[0].length; j++) {
      for (let i = 0; i < board.length; i++) {
        evaluations=this.evaluateDirections(board, i, j, playerStone, evaluations);
      }
     evaluations= this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
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
        evaluations= this.evaluateDirections(board, i, k - i, playerStone, evaluations);
      }
      this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
    }

    // From top-left to bottom-right diagonally
    for (let k = 1 - board.length; k < board.length; k++) {
      const iStart = Math.max(0, k);
      const iEnd = Math.min(board.length + k - 1, board.length - 1);
      for (let i = iStart; i <= iEnd; ++i) {
        evaluations=this.evaluateDirections(board, i, i - k, playerStone, evaluations);
      }
      evaluations=this.evaluateDirectionsAfterOnePass(evaluations, playerStone);
    }

    return evaluations[2];
  }

  private evaluateDirections(board: string[][], i: number, j: number, playerStone: string, evals: number[]): number[] {
    // Check if the selected player has a stone in the current cell
    if (board[i][j] === playerStone) {
      // Increment consecutive stones count
      evals[0]++;
    }
    // Check if cell is empty
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
      // No consecutive stones.
      // Current cell is empty, next consecutive set will have at most 1 blocked side.
      evals[1] = 1;
    }
    // Cell is occupied by the opponent
    // Check if there were any consecutive stones before this empty cell
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
    return evals;
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
    const winGuarantee = this.WIN_SCORE;

    // If both sides of a set are blocked, this set is worthless, return 0 points.
    if (blocks === 2 && count < 5) {
      return 0;
    }

    // console.log("count: "+count);
    // console.log("block: "+blocks);
    // console.log("player: "+playerStone);

    switch (count) {
      case 5: {
        console.log('5');
        return winGuarantee;
      }
      case 4: {
        if (playerStone === 'X') {
          console.log('4.1');
          return winGuarantee;
        } else {
          if (blocks === 0) {
            console.log('4.2');
            return winGuarantee / 4;
          }
          else {
            console.log('4.3');
            return 200;
          }
        }
      }
      case 3: {
        if (blocks === 0) {
          if (playerStone === 'O') {
             console.log('3.1');
            return 50000;
          }
          else {
            return 200;
          }
        } else {
          if (playerStone === 'O') {
            // console.log('3.2');
            return 10;
          } else {
            // console.log('3.3');
            return 5;
          }
        }
      }
      case 2: {
        if (blocks === 0) {
          if (playerStone === 'O') {
            // console.log('2.1');
            return 7;
          } else {
            // console.log('2.2');
            return 5;
          }
        } else {
          // console.log('2.3');
          return 3;
        }
      }
      case 1: {
        // console.log('1');
        return 1;
      }
    }

    return winGuarantee * 2;
  }




  // evaluate(board: string[][]): number {
  //   // Define the score values for different game states
  //   const winScore = 10000;
  //   const loseScore = -10000;
  //   const tieScore = 0;
  //   const blockingScore = 100;

  //   // Check for a winning state for 'O'
  //   if (this.checkWinningState(board, 'O')) {
  //     return winScore;
  //   }

  //   // Check for a winning state for 'X'
  //   if (this.checkWinningState(board, 'X')) {

  //     return loseScore;
  //   }

  //   // If neither 'O' nor 'X' has won, return a tie score
  //   return tieScore;
  // }





  //**Sampad logic***
  // private WINNING_PLY: number = 5;
  // private WINNER_SCORE: number = 50000;
  // private ROLE: string = 'O'; // Default role is 'O'

  // // Function to set the player role ('X' or 'O')
  // setPlayerRole(role: string): void {
  //   this.ROLE = role;
  // }

  // evaluate(board: string[][], maximizingPlayer: boolean): number {
  //   this.ROLE = maximizingPlayer ? 'O' : 'X';

  //   return this.findUtilityValue(board);
  // }


  // // Function to find the utility value of the current state
  // findUtilityValue(currentState: string[][]): number {
  //   let utilityScore = 0;

  //   for (let i = 0; i < currentState.length; i++) {
  //     for (let j = 0; j < currentState[i].length; j++) {
  //       utilityScore +=
  //         this.checkLeftSide(currentState, i, j) +
  //         this.checkRightSide(currentState, i, j) +
  //         this.checkUpSide(currentState, i, j) +
  //         this.checkDownSide(currentState, i, j) +
  //         this.checkLeftDiagonal(currentState, i, j) +
  //         this.checkRightDiagonal(currentState, i, j);
  //     }
  //   }

  //   return utilityScore;
  // }

  // // Function to check consecutive stones on the left side
  // private checkLeftSide(currentState: string[][], a: number, b: number): number {
  //   let counter = 0;

  //   for (let i = a; i >= 0; i--) {
  //     if (currentState[i][b] === this.ROLE) {
  //       counter++;
  //       if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
  //     } else {
  //       return counter * counter * 5;
  //     }
  //   }

  //   return counter;
  // }

  // // Function to check consecutive stones on the right side
  // private checkRightSide(currentState: string[][], a: number, b: number): number {
  //   let counter = 0;

  //   for (let i = a; i < currentState.length; i++) {
  //     if (currentState[i][b] === this.ROLE) {
  //       counter++;
  //       if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
  //     } else {
  //       return counter * counter * 5;
  //     }
  //   }

  //   return counter;
  // }

  // // Function to check consecutive stones on the up side
  // private checkUpSide(currentState: string[][], a: number, b: number): number {
  //   let counter = 0;

  //   for (let j = b; j >= 0; j--) {
  //     if (currentState[a][j] === this.ROLE) {
  //       counter++;
  //       if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
  //     } else {
  //       return counter * counter * 5;
  //     }
  //   }

  //   return counter;
  // }

  // // Function to check consecutive stones on the down side
  // private checkDownSide(currentState: string[][], a: number, b: number): number {
  //   let counter = 0;

  //   for (let j = b; j < currentState.length; j++) {
  //     if (currentState[a][j] === this.ROLE) {
  //       counter++;
  //       if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
  //     } else {
  //       return counter * counter * 5;
  //     }
  //   }

  //   return counter;
  // }

  // // Function to check consecutive stones on the left diagonal
  // private checkLeftDiagonal(currentState: string[][], a: number, b: number): number {
  //   let counter = 0;

  //   for (let i = a, j = b; i < currentState.length && j < currentState.length; i++, j++) {
  //     if (currentState[i][j] === this.ROLE) {
  //       counter++;
  //       if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
  //     } else {
  //       return counter * counter * 5;
  //     }
  //   }

  //   return counter;
  // }

  // // Function to check consecutive stones on the right diagonal
  // private checkRightDiagonal(currentState: string[][], a: number, b: number): number {
  //   let counter = 0;

  //   for (let i = a, j = b; i >= 0 && j >= 0; i--, j--) {
  //     if (currentState[i][j] === this.ROLE) {
  //       counter++;
  //       if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
  //     } else {
  //       return counter * counter * 5;
  //     }
  //   }

  //   return counter;
  // }
  
 

}
