import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MinimaxService } from 'src/app/services/minimax.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  selectedDifficulty: number = 3;

  constructor(public dialogRef: MatDialogRef<WelcomeComponent>,
    private minimax: MinimaxService) { }


  startGame() {
    this.minimax.maxDepth = this.selectedDifficulty;
    console.log(this.selectedDifficulty);
    this.dialogRef.close(this.selectedDifficulty);
  }
}
