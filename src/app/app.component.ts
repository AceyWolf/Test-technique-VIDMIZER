import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-technique-Vidmizer';
  nom: string = "test";
  prenom: string;
  telephone: number;
}
