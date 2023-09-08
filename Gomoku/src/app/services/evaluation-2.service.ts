import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Evaluation2Service {

  constructor() { }

  
  //**Sampad logic***
  private WINNING_PLY: number = 5;
  private WINNER_SCORE: number = 50000;
  private ROLE: string = 'O'; // Default role is 'O'
  
  // Function to set the player role ('X' or 'O')
  setPlayerRole(role: string): void {
    this.ROLE = role;
  }
  
  evaluate(board: string[][], maximizingPlayer: boolean): number {
    this.ROLE = maximizingPlayer ? 'O' : 'X';
  
    return this.findUtilityValue(board);
  }
  
  // Function to find the utility value of the current state
  findUtilityValue(currentState: string[][]): number {
    let utilityScore = 0;
  
    for (let i = 0; i < currentState.length; i++) {
      for (let j = 0; j < currentState[i].length; j++) {
        utilityScore +=
          this.myPlayerUtility(currentState, i, j) +
          this.blockedUtility(currentState, i, j) -
          this.opponentPlayerUtility(currentState, i, j);
      }
    }
  
    return utilityScore;
  }
  
  // Function to calculate utility for the current player
  private myPlayerUtility(currentState: string[][], i: number, j: number): number {
    return (
      this.checkLeftSide(currentState, i, j) +
      this.checkRightSide(currentState, i, j) +
      this.checkUpSide(currentState, i, j) +
      this.checkDownSide(currentState, i, j) +
      this.checkLeftUpDiagonal(currentState, i, j) +
      this.checkLeftDownDiagonal(currentState, i, j) +
      this.checkRightUpDiagonal(currentState, i, j) +
      this.checkRightDownDiagonal(currentState, i, j)
    );
  }
  
  // Function to calculate utility for the opponent player
  private opponentPlayerUtility(currentState: string[][], i: number, j: number): number {
    this.swapRole();
    const opponentUtility =
      this.checkLeftSide(currentState, i, j) +
      this.checkRightSide(currentState, i, j) +
      this.checkUpSide(currentState, i, j) +
      this.checkDownSide(currentState, i, j) +
      this.checkLeftUpDiagonal(currentState, i, j) +
      this.checkLeftDownDiagonal(currentState, i, j) +
      this.checkRightUpDiagonal(currentState, i, j) +
      this.checkRightDownDiagonal(currentState, i, j);
    this.swapRole(); // Reset ROLE to the original player
    return opponentUtility;
  }
  
  // Function to calculate utility for blocked cells
  private blockedUtility(currentState: string[][], i: number, j: number): number {
    let utilValue = 0;
    if (currentState[i][j] === this.ROLE) {
      this.swapRole();
      utilValue +=
        this.checkLeftSide(currentState, i, j - 1) +
        this.checkRightSide(currentState, i, j + 1) +
        this.checkUpSide(currentState, i - 1, j) +
        this.checkDownSide(currentState, i + 1, j) +
        this.checkLeftUpDiagonal(currentState, i - 1, j - 1) +
        this.checkLeftDownDiagonal(currentState, i + 1, j + 1) +
        this.checkRightUpDiagonal(currentState, i - 1, j + 1) +
        this.checkRightDownDiagonal(currentState, i + 1, j - 1);
      this.swapRole(); // Reset ROLE to the original player
    }
    return 20 * utilValue;
  }
  
  // Function to swap the player role
  private swapRole() {
    if (this.ROLE === 'O') {
      this.ROLE = 'X';
    } else {
      this.ROLE = 'O';
    }
  }
  
  // Function to check consecutive stones on the left side
  private checkLeftSide(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let i = a; i >= 0; i--) {
      if (currentState[i][b] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
  
  // Function to check consecutive stones on the right side
  private checkRightSide(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let i = a; i < currentState.length; i++) {
      if (currentState[i][b] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
  
  // Function to check consecutive stones on the up side
  private checkUpSide(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let j = b; j >= 0; j--) {
      if (currentState[a][j] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
  
  // Function to check consecutive stones on the down side
  private checkDownSide(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let j = b; j < currentState.length; j++) {
      if (currentState[a][j] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
  
  // Function to check consecutive stones on the left diagonal
  private checkLeftUpDiagonal(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let i = a, j = b; i < currentState.length && j < currentState.length; i++, j++) {
      if (currentState[i][j] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
  
  // Function to check consecutive stones on the right diagonal
  private checkRightDownDiagonal(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let i = a, j = b; i >= 0 && j >= 0; i--, j--) {
      if (currentState[i][j] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
  
  // Function to check consecutive stones on the left diagonal
  private checkLeftDownDiagonal(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let i = a, j = b; i < currentState.length && j >= 0; i++, j--) {
      if (currentState[i][j] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
  
  // Function to check consecutive stones on the right diagonal
  private checkRightUpDiagonal(currentState: string[][], a: number, b: number): number {
    let counter = 0;
  
    for (let i = a, j = b; i >= 0 && j < currentState.length; i--, j++) {
      if (currentState[i][j] === this.ROLE) {
        counter++;
        if (counter === this.WINNING_PLY) return this.WINNER_SCORE;
      } else {
        return counter * counter * 5;
      }
    }
  
    return counter;
  }
}
