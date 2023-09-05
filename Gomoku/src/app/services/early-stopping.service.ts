import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EarlyStoppingService {
// This variable is used to track the number of evaluations for benchmarking purposes.
private   WIN_SCORE: number = 100000000;
private evaluationCount = {
  count: 0,
  increment: function () {
    this.count++;
  },
  reset: function () {
    this.count = 0;
  },
};
  constructor() { }
  evaluateBoardForWhite(board: any, blacksTurn: boolean): number {
    this.evaluationCount.increment();

    // Get board score of both players.
    let blackScore = this.getScore(board, true, blacksTurn);
    let whiteScore = this.getScore(board, false, blacksTurn);

    if (blackScore === 0) {
      blackScore = 1.0;
    }

    // Calculate relative score of white against black
    return whiteScore / blackScore;
  }
 
  private getScore(board: any, forBlack: boolean, blacksTurn: boolean) {
    // Read the board
    const boardMatrix = board.getBoardMatrix();

    // Calculate the score for each of the 3 directions
    return (
      this.evaluateHorizontal(boardMatrix, forBlack, blacksTurn) +
      this.evaluateVertical(boardMatrix, forBlack, blacksTurn) +
      this.evaluateDiagonal(boardMatrix, forBlack, blacksTurn)
    );
  }
  evaluateHorizontal( boardMatrix: number[][], // Assuming boardMatrix is a 2D array of numbers
  forBlack: boolean,
  playersTurn: boolean) {
    const evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[0].length; j++) {
            this.evaluateDirections(boardMatrix, i, j, forBlack, playersTurn, evaluations);
        }
        this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
    }

    return evaluations[2];
}

 evaluateVertical( boardMatrix: number[][], // Assuming boardMatrix is a 2D array of numbers
forBlack: boolean,
playersTurn: boolean) {
    const evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

    for (let j = 0; j < boardMatrix[0].length; j++) {
        for (let i = 0; i < boardMatrix.length; i++) {
            this.evaluateDirections(boardMatrix, i, j, forBlack, playersTurn, evaluations);
        }
        this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
    }

    return evaluations[2];
}

 evaluateDiagonal( boardMatrix: number[][], // Assuming boardMatrix is a 2D array of numbers
forBlack: boolean,
playersTurn: boolean) {
    const evaluations = [0, 2, 0]; // [0] -> consecutive count, [1] -> block count, [2] -> score

    // From bottom-left to top-right diagonally
    for (let k = 0; k <= 2 * (boardMatrix.length - 1); k++) {
        const iStart = Math.max(0, k - boardMatrix.length + 1);
        const iEnd = Math.min(boardMatrix.length - 1, k);
        for (let i = iStart; i <= iEnd; ++i) {
            this.evaluateDirections(boardMatrix, i, k - i, forBlack, playersTurn, evaluations);
        }
        this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
    }

    // From top-left to bottom-right diagonally
    for (let k = 1 - boardMatrix.length; k < boardMatrix.length; k++) {
        const iStart = Math.max(0, k);
        const iEnd = Math.min(boardMatrix.length + k - 1, boardMatrix.length - 1);
        for (let i = iStart; i <= iEnd; ++i) {
            this.evaluateDirections(boardMatrix, i, i - k, forBlack, playersTurn, evaluations);
        }
        this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
    }

    return evaluations[2];
}
 evaluateDirections(boardMatrix: number[][], i: number, j: number, isBot: boolean, botsTurn: boolean, evals: number[]) {
  // Check if the selected player has a stone in the current cell
  if (boardMatrix[i][j] === (isBot ? 2 : 1)) {
      // Increment consecutive stones count
      evals[0]++;
  }
  // Check if cell is empty
  else if (boardMatrix[i][j] === 0) {
      // Check if there were any consecutive stones before this empty cell
      if (evals[0] > 0) {
          // Consecutive set is not blocked by the opponent, decrement block count
          evals[1]--;
          // Get consecutive set score
          evals[2] += this.getConsecutiveSetScore(evals[0], evals[1], isBot === botsTurn);
          // Reset consecutive stone count
          evals[0] = 0;
          // Current cell is empty, next consecutive set will have at most 1 blocked side.
      }
      // No consecutive stones.
      // Current cell is empty, next consecutive set will have at most 1 blocked side.
      evals[1] = 1;
  }
  // Cell is occupied by opponent
  // Check if there were any consecutive stones before this empty cell
  else if (evals[0] > 0) {
      // Get consecutive set score
      evals[2] += this.getConsecutiveSetScore(evals[0], evals[1], isBot === botsTurn);
      // Reset consecutive stone count
      evals[0] = 0;
      // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
      evals[1] = 2;
  } else {
      // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
      evals[1] = 2;
  }
}

 evaluateDirectionsAfterOnePass(evals: number[], isBot: boolean, playersTurn: boolean) {
  // End of row, check if there were any consecutive stones before we reached the right border
  if (evals[0] > 0) {
      evals[2] += this.getConsecutiveSetScore(evals[0], evals[1], isBot === playersTurn);
  }
  // Reset consecutive stone and blocks count
  evals[0] = 0;
  evals[1] = 2;
}
 getConsecutiveSetScore(count: number, blocks: number, currentTurn: boolean): number {
  const winGuarantee = 1000000;
  
  // If both sides of a set are blocked, this set is worthless return 0 points.
  if (blocks === 2 && count < 5) return 0;

  switch (count) {
      case 5: {
          // 5 consecutive wins the game
          return this.WIN_SCORE;
      }
      case 4: {
          // 4 consecutive stones in the user's turn guarantees a win.
          // (User can win the game by placing the 5th stone after the set)
          if (currentTurn) return winGuarantee;
          else {
              // Opponent's turn
              // If neither side is blocked, 4 consecutive stones guarantee a win in the next turn.
              // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
              // in the next turn). So a relatively high score is given for this set.
              if (blocks === 0) return winGuarantee / 4;
              // If only a single side is blocked, 4 consecutive stones limit the opponent's move
              // (Opponent can only place a stone that will block the remaining side, otherwise the game is lost
              // in the next turn). So a relatively high score is given for this set.
              else return 200;
          }
      }
      case 3: {
          // 3 consecutive stones
          if (blocks === 0) {
              // Neither side is blocked.
              // If it's the current player's turn, a win is guaranteed in the next 2 turns.
              // (User places another stone to make the set 4 consecutive; opponent can only block one side)
              // However, the opponent may win the game in the next turn; therefore, this score is lower than win
              // guaranteed scores but still a very high score.
              if (currentTurn) return 50000;
              // If it's the opponent's turn, this set forces the opponent to block one of the sides of the set.
              // So a relatively high score is given for this set.
              else return 200;
          } else {
              // One of the sides is blocked.
              // Playmaker scores
              if (currentTurn) return 10;
              else return 5;
          }
      }
      case 2: {
          // 2 consecutive stones
          // Playmaker scores
          if (blocks === 0) {
              if (currentTurn) return 7;
              else return 5;
          } else {
              return 3;
          }
      }
      case 1: {
          return 1;
      }
  }

  // More than 5 consecutive stones?
  return this.WIN_SCORE * 2;
}
  
}
