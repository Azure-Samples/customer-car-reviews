import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  title = 'Car Reviews';
  constructor(private router: Router) {}
  
    gotoDetail(): void {
      this.router.navigate(['/detail']);
    }
}
