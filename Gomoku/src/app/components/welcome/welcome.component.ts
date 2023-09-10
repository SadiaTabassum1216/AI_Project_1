import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  selectedDifficulty: string = ''; // Variable to store the selected difficulty

  startGame() {
    if (this.selectedDifficulty) {
      // The user has selected a difficulty, you can start the game here
      console.log(`Starting the game with difficulty: ${this.selectedDifficulty}`);
      
      // You can add your game logic here, e.g., navigate to the game board component
    } else {
      // Display an error message or handle the case where the user hasn't selected a difficulty
      console.error('Please select a difficulty before starting the game.');
    }
  }
}
