import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Evaluation2Service {

  private WINNING_PLY: number = 5;
  private WINNER_SCORE: number = 50000;
  private ROLE: string = 'O'; // Default role is 'O'

  setPlayerRole(role: string): void {
    this.ROLE = role;
  }

  evaluate(board: string[][], maximizingPlayer: boolean): number {
    this.ROLE = maximizingPlayer ? 'O' : 'X';
    return this.findUtilityValue(board);
  }

  findUtilityValue(currentState: string[][]): number {
    let utilityScore = 0;

    for (let i = 0; i < currentState.length; i++) {
      for (let j = 0; j < currentState[i].length; j++) {
        const cellValue = currentState[i][j];
        utilityScore +=
          this.myPlayerUtility(currentState, i, j, cellValue) +
          this.blockedUtility(currentState, i, j, cellValue) -
          this.opponentPlayerUtility(currentState, i, j, cellValue);
      }
    }

    return utilityScore;
  }

  private myPlayerUtility(currentState: string[][], i: number, j: number, cellValue: string): number {
    return (
      this.checkSide(currentState, i, j, cellValue, 0, -1) +
      this.checkSide(currentState, i, j, cellValue, 0, 1) +
      this.checkSide(currentState, i, j, cellValue, -1, 0) +
      this.checkSide(currentState, i, j, cellValue, 1, 0) +
      this.checkSide(currentState, i, j, cellValue, -1, -1) +
      this.checkSide(currentState, i, j, cellValue, 1, 1) +
      this.checkSide(currentState, i, j, cellValue, -1, 1) +
      this.checkSide(currentState, i, j, cellValue, 1, -1)
    );
  }

  private opponentPlayerUtility(currentState: string[][], i: number, j: number, cellValue: string): number {
    const originalRole = this.ROLE;
    this.swapRole();
    const opponentUtility =
      this.checkSide(currentState, i, j, cellValue, 0, -1) +
      this.checkSide(currentState, i, j, cellValue, 0, 1) +
      this.checkSide(currentState, i, j, cellValue, -1, 0) +
      this.checkSide(currentState, i, j, cellValue, 1, 0) +
      this.checkSide(currentState, i, j, cellValue, -1, -1) +
      this.checkSide(currentState, i, j, cellValue, 1, 1) +
      this.checkSide(currentState, i, j, cellValue, -1, 1) +
      this.checkSide(currentState, i, j, cellValue, 1, -1);
    this.ROLE = originalRole; // Reset ROLE to the original player
    return opponentUtility;
  }

  private blockedUtility(currentState: string[][], i: number, j: number, cellValue: string): number {
    let utilValue = 0;
    if (cellValue === this.ROLE) {
      const originalRole = this.ROLE;
      this.swapRole();
      utilValue +=
        this.checkSide(currentState, i, j, cellValue, 0, -1) +
        this.checkSide(currentState, i, j, cellValue, 0, 1) +
        this.checkSide(currentState, i, j, cellValue, -1, 0) +
        this.checkSide(currentState, i, j, cellValue, 1, 0) +
        this.checkSide(currentState, i, j, cellValue, -1, -1) +
        this.checkSide(currentState, i, j, cellValue, 1, 1) +
        this.checkSide(currentState, i, j, cellValue, -1, 1) +
        this.checkSide(currentState, i, j, cellValue, 1, -1);
      this.ROLE = originalRole; // Reset ROLE to the original player
    }
    return 20 * utilValue;
  }

  private swapRole() {
    this.ROLE = this.ROLE === 'O' ? 'X' : 'O';
  }

  private checkSide(
    currentState: string[][], i: number, j: number, cellValue: string,
    dx: number, dy: number
  ): number {
    let counter = 0;
    for (let x = i, y = j; x >= 0 && x < currentState.length && y >= 0 && y < currentState[i].length; x += dx, y += dy) {
      if (currentState[x][y] === cellValue) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
    return counter;
  }
}
