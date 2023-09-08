class BoardEvaluator {
    evaluateBoard(
      FiveInRow: any[],
      LiveFour: any[],
      LiveThree: any[],
      DeadFour: any[],
      jLivethree: any[],
      CDeadFour: any[]
    ): number {
      let BoardEval = 0;
  
      // Condition 1
      if (FiveInRow.length !== 0) {
        BoardEval += 100000;
      }
  
      // Condition 2
      if (LiveFour.length === 1) {
        BoardEval += 15000;
      }
  
      // Condition 3
      if (
        LiveThree.length >= 2 ||
        DeadFour.length === 2 ||
        (DeadFour.length === 1 && LiveThree.length === 1)
      ) {
        BoardEval += 10000;
      }
  
      // Condition 4
      if (LiveThree.length + jLivethree.length === 2) {
        BoardEval += 5000;
      }
  
      // Condition 5
      if (DeadFour.length !== 0) {
        BoardEval += 1000;
      }
  
      // Condition 6
      if (jLivethree.length !== 0) {
        BoardEval += 300;
      }
  
      // Condition 7
      if (CDeadFour.length !== 0) {
        BoardEval += CDeadFour.length * 50;
      }
  
      return BoardEval;
    }
  }
  
  // Example usage
  const evaluator = new BoardEvaluator();
  
  // Example values for the conditions (replace these with your actual data)
  const FiveInRow: any[] = [];
  const LiveFour = [{}, {}];
  const LiveThree = [{}, {}];
  const DeadFour = [{}, {}];
  const jLivethree = [{}, {}];
  const CDeadFour = [{}, {}];
  
  const boardEval = evaluator.evaluateBoard(
    FiveInRow,
    LiveFour,
    LiveThree,
    DeadFour,
    jLivethree,
    CDeadFour
  );
  
  console.log("Board Evaluation:", boardEval);
  