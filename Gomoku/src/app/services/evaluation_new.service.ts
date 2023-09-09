import { Injectable } from '@angular/core';
import { MovesService } from './moves.service';

@Injectable({
  providedIn: 'root'
})
export class Evaluation2Service {

  constructor(private moves: MovesService) { }

  playerStone: string = '';
  opponent: string = '';;
  max_count: number = 0;


  evaluate(board: string[][], maximizingPlayer: boolean, move: [number, number]): number {
    this.playerStone = maximizingPlayer ? 'O' : 'X';
    this.opponent = maximizingPlayer ? 'X' : 'O';

    const [moveRow, moveCol] = move;

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

  calculateHorizontalCount(board: string[][], row: number, col: number, stone: string): number {
    let consecutiveCount = 0;
    let max_count = 0;
    let empty_count = 0;
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
      else if (newCol >= 0 && newCol < board[0].length && (board[row][newCol] === '' && empty_count <= 1)) {
        consecutiveCount++;
        consecutiveString += '_';
        empty_count++;
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
        if (consecutiveCount >= 5)
          break

      }
      else {
        consecutiveCount = 0;
        empty_count = 0;
        consecutiveString = "";
        break;
      }
    }
    // console.log("Horizontal: " + max_count);
    return Math.pow(10, max_count);
  }


  calculateVerticalCount(board: string[][], row: number, col: number, stone: string): number {
    let consecutiveCount = 0;
    let max_count = 0;
    let empty_count = 0;
    let consecutiveString = "";

    for (let i = -4; i <= 4; i++) {
      const newRow = row + i;
      if (newRow >= 0 && newRow < board.length && (board[newRow][col] === stone)) {
        consecutiveCount++;
        consecutiveString += stone;
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
      }
      else if (newRow >= 0 && newRow < board.length && (board[newRow][col] === '' && empty_count <= 1)) {
        consecutiveCount++;
        empty_count++;
        consecutiveString += '_';
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
        if (consecutiveCount >= 5)
          break

      }
      else {
        consecutiveCount = 0;
        empty_count = 0;
        consecutiveString += "";
        break;
      }
    }
    // console.log("Vertical: " + max_count);
    return Math.pow(10, max_count);
  }

  calculateDiagonal1Count(board: string[][], row: number, col: number, stone: string): number {
    let consecutiveCount = 0;
    let max_count = 0;
    let empty_count = 0;
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
        (board[newRow][newCol] === '' && empty_count <= 1)) {
        consecutiveCount++;
        empty_count++;
        consecutiveString += '_';
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
        if (consecutiveCount >= 5)
          break

      }
      else {
        consecutiveCount = 0;
        empty_count = 0;
        consecutiveString += "";
        break;
      }
    }
    // console.log("Diagonal(D-U): " + max_count);
    return Math.pow(10, max_count);
  }

  calculateDiagonal2Count(board: string[][], row: number, col: number, stone: string): number {
    let consecutiveCount = 0;
    let max_count = 0;
    let empty_count = 0;
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
        (board[newRow][newCol] === '' && empty_count <= 1)) {
        consecutiveCount++;
        empty_count++;
        consecutiveString += '_';
        if (consecutiveCount > max_count)
          max_count = consecutiveCount;
        if (consecutiveCount >= 5)
          break

      }
      else {
        consecutiveCount = 0;
        empty_count = 0;
        consecutiveString += "";
        break;
      }
    }
    // console.log("Diagonal(U-D): " + max_count);
    return Math.pow(10, max_count);
  }

}