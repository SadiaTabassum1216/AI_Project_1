// export class Minimax {

// import { Board } from "./board.model";

// // }
// class Minimax {
//   public static evaluationCount: number = 0;
//   private board: Board;
//   private static readonly WIN_SCORE: number = 100_000_000;

//   constructor(board: Board) {
//     this.board = board;
//   }

//   public static getWinScore(): number {
//     return Minimax.WIN_SCORE;
//   }

//   public static evaluateBoardForWhite(board: Board, blacksTurn: boolean): number {
//     Minimax.evaluationCount++;

//     let blackScore: number = Minimax.getScore(board, true, blacksTurn);
//     const whiteScore: number = Minimax.getScore(board, false, blacksTurn);

//     if (blackScore === 0) blackScore = 1.0;

//     return whiteScore / blackScore;
//   }

//   public static getScore(board: Board, forBlack: boolean, blacksTurn: boolean): number {
//     const boardMatrix: number[][] = board.getBoardMatrix();

//     return (
//       this.evaluateHorizontal(boardMatrix, forBlack, blacksTurn) +
//       this.evaluateVertical(boardMatrix, forBlack, blacksTurn) +
//       this.evaluateDiagonal(boardMatrix, forBlack, blacksTurn)
//     );
//   }

//   public calculateNextMove(depth: number): number[] {
//     board.thinkingStarted();

//     const move: number[] = [];

//     const startTime: number = Date.now();

//     const bestMove: any[] | null = this.searchWinningMove(board);

//     if (bestMove !== null) {
//       move[0] = bestMove[1];
//       move[1] = bestMove[2];
//     } else {
//       const tempMove: any[] = this.minimaxSearchAB(depth, new Board(board), true, -1.0, Minimax.getWinScore());

//       if (tempMove[1] === null) {
//         move = null;
//       } else {
//         move[0] = tempMove[1];
//         move[1] = tempMove[2];
//       }
//     }
//     console.log(
//       `Cases calculated: ${Minimax.evaluationCount} Calculation time: ${Date.now() - startTime} ms`
//     );

//     board.thinkingFinished();

//     Minimax.evaluationCount = 0;

//     return move;
//   }

//   private minimaxSearchAB(
//     depth: number,
//     dummyBoard: Board,
//     max: boolean,
//     alpha: number,
//     beta: number
//   ): any[] {
//     if (depth === 0) {
//       return [this.evaluateBoardForWhite(dummyBoard, !max), null, null];
//     }

//     const allPossibleMoves: number[][] = dummyBoard.generateMoves();

//     if (allPossibleMoves.length === 0) {
//       return [this.evaluateBoardForWhite(dummyBoard, !max), null, null];
//     }

//     const bestMove: any[] = [];

//     if (max) {
//       bestMove[0] = -1.0;

//       for (const move of allPossibleMoves) {
//         dummyBoard.addStoneNoGUI(move[1], move[0], false);

//         const tempMove: any[] = this.minimaxSearchAB(
//           depth - 1,
//           dummyBoard,
//           false,
//           alpha,
//           beta
//         );

//         dummyBoard.removeStoneNoGUI(move[1], move[0]);

//         if (tempMove[0] > alpha) {
//           alpha = tempMove[0];
//         }

//         if (tempMove[0] >= beta) {
//           return tempMove;
//         }

//         if (tempMove[0] > bestMove[0]) {
//           bestMove[0] = tempMove[0];
//           bestMove[1] = move[0];
//           bestMove[2] = move[1];
//         }
//       }
//     } else {
//       bestMove[0] = 100_000_000.0;
//       bestMove[1] = allPossibleMoves[0][0];
//       bestMove[2] = allPossibleMoves[0][1];

//       for (const move of allPossibleMoves) {
//         dummyBoard.addStoneNoGUI(move[1], move[0], true);

//         const tempMove: any[] = this.minimaxSearchAB(
//           depth - 1,
//           dummyBoard,
//           true,
//           alpha,
//           beta
//         );

//         dummyBoard.removeStoneNoGUI(move[1], move[0]);

//         if (tempMove[0] < beta) {
//           beta = tempMove[0];
//         }

//         if (tempMove[0] <= alpha) {
//           return tempMove;
//         }

//         if (tempMove[0] < bestMove[0]) {
//           bestMove[0] = tempMove[0];
//           bestMove[1] = move[0];
//           bestMove[2] = move[1];
//         }
//       }
//     }

//     return bestMove;
//   }

//   private searchWinningMove(board: Board): any[] | null {
//     const allPossibleMoves: number[][] = board.generateMoves();
//     const winningMove: any[] = [];

//     for (const move of allPossibleMoves) {
//       Minimax.evaluationCount++;
//       const dummyBoard: Board = new Board(board);
//       dummyBoard.addStoneNoGUI(move[1], move[0], false);

//       if (Minimax.getScore(dummyBoard, false, false) >= Minimax.WIN_SCORE) {
//         winningMove[1] = move[0];
//         winningMove[2] = move[1];
//         return winningMove;
//       }
//     }
//     return null;
//   }

//   private evaluateHorizontal(
//     boardMatrix: number[][],
//     forBlack: boolean,
//     playersTurn: boolean
//   ): number {
//     const evaluations: number[] = [0, 2, 0];

//     for (let i = 0; i < boardMatrix.length; i++) {
//       for (let j = 0; j < boardMatrix[0].length; j++) {
//         this.evaluateDirections(boardMatrix, i, j, forBlack, playersTurn, evaluations);
//       }
//       this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
//     }

//     return evaluations[2];
//   }

//   private evaluateVertical(
//     boardMatrix: number[][],
//     forBlack: boolean,
//     playersTurn: boolean
//   ): number {
//     const evaluations: number[] = [0, 2, 0];

//     for (let j = 0; j < boardMatrix[0].length; j++) {
//       for (let i = 0; i < boardMatrix.length; i++) {
//         this.evaluateDirections(boardMatrix, i, j, forBlack, playersTurn, evaluations);
//       }
//       this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
//     }

//     return evaluations[2];
//   }

//   private evaluateDiagonal(
//     boardMatrix: number[][],
//     forBlack: boolean,
//     playersTurn: boolean
//   ): number {
//     const evaluations: number[] = [0, 2, 0];

//     for (let k = 0; k <= 2 * (boardMatrix.length - 1); k++) {
//       const iStart: number = Math.max(0, k - boardMatrix.length + 1);
//       const iEnd: number = Math.min(boardMatrix.length - 1, k);

//       for (let i = iStart; i <= iEnd; ++i) {
//         this.evaluateDirections(boardMatrix, i, k - i, forBlack, playersTurn, evaluations);
//       }

//       this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
//     }

//     for (let k = 1 - boardMatrix.length; k < boardMatrix.length; k++) {
//       const iStart: number = Math.max(0, k);
//       const iEnd: number = Math.min(boardMatrix.length + k - 1, boardMatrix.length - 1);

//       for (let i = iStart; i <= iEnd; ++i) {
//         this.evaluateDirections(boardMatrix, i, i - k, forBlack, playersTurn, evaluations);
//       }

//       this.evaluateDirectionsAfterOnePass(evaluations, forBlack, playersTurn);
//     }

//     return evaluations[2];
//   }

//   private evaluateDirections(
//     boardMatrix: number[][],
//     i: number,
//     j: number,
//     isBot: boolean,
//     botsTurn: boolean,
//     eval: number[]
//   ): void {
//     if (boardMatrix[i][j] === (isBot ? 2 : 1)) {
//       eval[0]++;
//     } else if (boardMatrix[i][j] === 0) {
//       if (eval[0] > 0) {
//         eval[1]--;
//         eval[2] += this.getConsecutiveSetScore(eval[0], eval[1], isBot === botsTurn);
//         eval[0] = 0;
//       }
//       eval[1] = 1;
//     } else if (eval[0] > 0) {
//       eval[2] += this.getConsecutiveSetScore(eval[0], eval[1], isBot === botsTurn);
//       eval[0] = 0;
//       eval[1] = 2;
//     } else {
//       eval[1] = 2;
//     }
//   }

//   private evaluateDirectionsAfterOnePass(eval: number[], isBot: boolean, playersTurn: boolean): void {
//     if (eval[0] > 0) {
//       eval[2] += this.getConsecutiveSetScore(eval[0], eval[1], isBot === playersTurn);
//     }
//     eval[0] = 0;
//     eval[1] = 2;
//   }

//   private getConsecutiveSetScore(count: number, blocks: number, currentTurn: boolean): number {
//     const winGuarantee: number = 1000000;

//     if (blocks === 2 && count < 5) return 0;

//     switch (count) {
//       case 5: {
//         return Minimax.WIN_SCORE;
//       }
//       case 4: {
//         if (currentTurn) return winGuarantee;
//         else {
//           if (blocks === 0) return winGuarantee / 4;
//           else return 200;
//         }
//       }
//       case 3: {
//         if (blocks === 0) {
//           if (currentTurn) return 50000;
//           else return 200;
//         } else {
//           return 10;
//         }
//       }
//       case 2: {
//         if (blocks === 0) {
//           if (currentTurn) return 7;
//           else return 5;
//         } else {
//           return 3;
//         }
//       }
//       case 1: {
//         return 1;
//       }
//     }

//     return Minimax.WIN_SCORE * 2;
//   }
// }
