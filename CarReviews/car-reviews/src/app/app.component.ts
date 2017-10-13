import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Car Reviews';

  constructor(private router: Router){}

  home() {
    this.router.navigate(['/dashboard']);
  }
}


