import { Injectable } from '@angular/core';
import { MovesService } from './moves.service';
import { Cell_evaluation } from '../models/cell_eval.model';

@Injectable({
  providedIn: 'root'
})
export class Evaluation2Service {

  constructor() { }

  playerStone: number = 0;
  opponent: number = 0;
  
  private WIN_SCORE: number = 10_000_000;


  evaluate(board: number[][], maximizingPlayer: boolean): number {
    this.playerStone = maximizingPlayer ? 1 : 2;
    this.opponent = maximizingPlayer ? 2 : 1;

    const [moveRow, moveCol] = [-1,-1];

    //move pathabo na
    //full board evaluate hobe
    //ekta perameter hoilo maximizing player true ki na. 
    //second arektay true/false dibo kar jonno calculat kori

    const horizontalPlayerScore = this.calculateHorizontalCount(board, moveRow, moveCol, this.playerStone);
    const verticalPlayerScore = this.calculateVerticalCount(board, moveRow, moveCol, this.playerStone);
    const diagonalPlayerScore1 = this.calculateDiagonal1Count(board, moveRow, moveCol, this.playerStone);
    const diagonalPlayerScore2 = this.calculateDiagonal2Count(board, moveRow, moveCol, this.playerStone);

    const horizontalOpponentScore = this.calculateHorizontalCount(board, moveRow, moveCol, this.opponent);
    const verticalOpponentScore = this.calculateVerticalCount(board, moveRow, moveCol, this.opponent);
    const diagonalOpponentScore1 = this.calculateDiagonal1Count(board, moveRow, moveCol, this.opponent);
    const diagonalOpponentScore2 = this.calculateDiagonal2Count(board, moveRow, moveCol, this.opponent);

    const playerScore = horizontalPlayerScore + verticalPlayerScore + diagonalPlayerScore1 + diagonalPlayerScore2;
    const opponentScore = horizontalOpponentScore + verticalOpponentScore + diagonalOpponentScore1 + diagonalOpponentScore2;

    return playerScore - opponentScore;
  }

 

  calculateHorizontalCount(board: number[][], row: number, col: number, stone: number): number {
    let consecutiveCount = 0;
    let max_count = 0;

    let consecutiveString = "";

    for (let i = -4; i <= 4; i++) {
      const newCol = col + i;
      if (newCol >= 0 && newCol < board[0].length && (board[row][newCol] === stone)) {
        consecutiveCount++;
        consecutiveString += stone;
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
        if (consecutiveCount >= 5)
          break

      }
      else if (newCol >= 0 && newCol < board[0].length && (board[row][newCol] === 0)) {
        if (this.countSpaces(consecutiveString.trim()) < 1) {
          consecutiveCount++;
          consecutiveString += ' ';
          if (consecutiveCount > max_count)
            max_count = consecutiveCount;
          if (consecutiveCount >= 5)
            break
        }

      }
      else {
        consecutiveCount = 0;
        consecutiveString = "";
        break;
      }
    }
    // console.log("Horizontal: " + max_count);

    let block_count = 2;
    if (consecutiveString.trim().length < consecutiveString.trimStart().length)
      block_count--;
    if (consecutiveString.trim().length < consecutiveString.trimEnd().length)
      block_count;

    return Math.pow(10, consecutiveString.trim().length) - Math.pow(5, block_count);
  }


  calculateVerticalCount(board: number[][], row: number, col: number, stone: number): number {
    let consecutiveCount = 0;
    let max_count = 0;

    let consecutiveString = "";

    for (let i = -4; i <= 4; i++) {
      const newRow = row + i;
      if (newRow >= 0 && newRow < board.length && (board[newRow][col] === stone)) {
        consecutiveCount++;
        consecutiveString += stone;
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
      }
      else if (newRow >= 0 && newRow < board.length && (board[newRow][col] === 0)) {
        if (this.countSpaces(consecutiveString.trim()) < 1) {
          consecutiveCount++;
          consecutiveString += ' ';
          if (consecutiveCount > max_count)
            max_count = consecutiveCount;
          if (consecutiveCount >= 5)
            break
        }
      }
      else {
        consecutiveCount = 0;

        consecutiveString += "";
        break;
      }
    }
    // console.log("Vertical: " + max_count);

    let block_count = 2;
    if (consecutiveString.trim().length < consecutiveString.trimStart().length)
      block_count--;
    if (consecutiveString.trim().length < consecutiveString.trimEnd().length)
      block_count;

    return Math.pow(10, consecutiveString.trim().length) - Math.pow(5, block_count);
    return Math.pow(10, max_count);
  }

  calculateDiagonal1Count(board: number[][], row: number, col: number, stone: number): number {
    let consecutiveCount = 0;
    let max_count = 0;

    let consecutiveString = "";

    for (let i = -4; i <= 4; i++) {
      const newRow = row + i;
      const newCol = col + i;
      if (
        newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length &&
        (board[newRow][newCol] === stone)
      ) {
        consecutiveCount++;
        consecutiveString += stone;
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
        if (consecutiveCount >= 5)
          break
      }
      else if (newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length &&
        (board[newRow][newCol] === 0)) {
          if (this.countSpaces(consecutiveString.trim()) < 1) {
            consecutiveCount++;
            consecutiveString += ' ';
            if (consecutiveCount > max_count)
              max_count = consecutiveCount;
            if (consecutiveCount >= 5)
              break
          }

      }
      else {
        consecutiveCount = 0;

        consecutiveString += "";
        break;
      }
    }
    // console.log("Diagonal(D-U): " + max_count);

    let block_count = 2;
    if (consecutiveString.trim().length < consecutiveString.trimStart().length)
      block_count--;
    if (consecutiveString.trim().length < consecutiveString.trimEnd().length)
      block_count;

    return Math.pow(10, consecutiveString.trim().length) - Math.pow(5, block_count);
    return Math.pow(10, max_count);
  }

  calculateDiagonal2Count(board: number[][], row: number, col: number, stone: number): number {
    let consecutiveCount = 0;
    let max_count = 0;

    let consecutiveString = "";

    for (let i = -4; i <= 4; i++) {
      const newRow = row - i;
      const newCol = col + i;
      if (
        newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length &&
        (board[newRow][newCol] === stone)
      ) {
        consecutiveCount++;
        consecutiveString += stone;
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
        if (consecutiveCount >= 5)
          break
      }
      else if (newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length &&
        (board[newRow][newCol] === 0)) {
          if (this.countSpaces(consecutiveString.trim()) < 1) {
            consecutiveCount++;
            consecutiveString += ' ';
            if (consecutiveCount > max_count)
              max_count = consecutiveCount;
            if (consecutiveCount >= 5)
              break
          }

      }
      else {
        consecutiveCount = 0;

        consecutiveString += "";
        break;
      }
    }
    // console.log("Diagonal(U-D): " + max_count);

    let block_count = 2;
    if (consecutiveString.trim().length < consecutiveString.trimStart().length)
      block_count--;
    if (consecutiveString.trim().length < consecutiveString.trimEnd().length)
      block_count;

    return Math.pow(10, consecutiveString.trim().length) - Math.pow(5, block_count);
    return Math.pow(10, max_count);
  }


  countSpaces(inputString: string) {
    let spaceCount = 0;
    for (let i = 0; i < inputString.length; i++) {
      if (inputString[i] === ' ') {
        spaceCount++;
      }
    }
    return spaceCount;
  }


   private evaluateHorizontal(board: number[][], forHuman: boolean, maximizingPlayer: boolean): number {
    let evaluation = new Cell_evaluation();

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {

        //milse
        if (board[i][j] === (forHuman ? 2 : 1)) {
          evaluation.consecutiveCount++;
        }
    
        //blank
        else if (board[i][j] === 0) {
          // Check if there were any consecutive stones before this empty cell
          if (evaluation.consecutiveCount > 0) {
            // Consecutive set is not blocked by the opponent, decrement block count
            evaluation.blockCount--;
            // Get consecutive set score
            evaluation.score += this.getConsecutiveSetScore(evaluation.consecutiveCount, evaluation.blockCount, forHuman === maximizingPlayer);
            // Reset consecutive stone count
            evaluation.consecutiveCount = 0;
            // Current cell is empty, next consecutive set will have at most 1 blocked side.
          }
    
          evaluation.blockCount = 1;
        }
        //mile nai
        else if (evaluation.consecutiveCount > 0) {
          // Get consecutive set score
          evaluation.score += this.getConsecutiveSetScore(evaluation.consecutiveCount, evaluation.blockCount, forHuman === maximizingPlayer);
          // Reset consecutive stone count
          evaluation.consecutiveCount = 0;
          // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
          evaluation.blockCount = 2;
        } else {
          // Current cell is occupied by the opponent, next consecutive set may have 2 blocked sides
          evaluation.blockCount = 2;
        }
      }
      if (evaluation.consecutiveCount > 0) {
        evaluation.score += this.getConsecutiveSetScore(evaluation.consecutiveCount, evaluation.blockCount, forHuman === maximizingPlayer);
      }
      // Reset consecutive stone and blocks count
      evaluation.consecutiveCount = 0;
      evaluation.blockCount = 2;

    }

    return evaluation.score;
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