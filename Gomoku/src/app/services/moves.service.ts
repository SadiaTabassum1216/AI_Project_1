import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovesService {

  constructor() { }

  generateMoves(board: number[][]): [number, number][] {
    const moveList: [number, number][] = [];

    const boardSize = board.length;

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] !== 0) continue;

        if (i > 0) {
          if (j > 0) {
            if (board[i - 1][j - 1] !== 0 || board[i][j - 1] !== 0) {
              moveList.push([i, j]);
              continue;
            }
          }
          if (j < boardSize - 1) {
            if (board[i - 1][j + 1] !== 0 || board[i][j + 1] !== 0) {
              moveList.push([i, j]);
              continue;
            }
          }
          if (board[i - 1][j] !== 0) {
            moveList.push([i, j]);
            continue;
          }
        }
        if (i < boardSize - 1) {
          if (j > 0) {
            if (board[i + 1][j - 1] !== 0 || board[i][j - 1] !== 0) {
              moveList.push([i, j]);
              continue;
            }
          }
          if (j < boardSize - 1) {
            if (board[i + 1][j + 1] !== 0 || board[i][j + 1] !== 0) {
              moveList.push([i, j]);
              continue;
            }
          }
          if (board[i + 1][j] !== 0) {
            moveList.push([i, j]);
            continue;
          }
        }
      }
    }

    return moveList;
  }

}
