import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit{

  title = 'Car Reviews';
  state = 'approved';
  approvedCars = [];
  rejectedCars = [];
  pendingCars = [];
  constructor(private router: Router, private http: Http) {}
  
  ngOnInit(): void {

    let headers = new Headers();
    
    let options = new RequestOptions({
      headers: headers
    });
    this.http.get('http://localhost:7071/api/GetCars/approved')
    .subscribe(
      data => {
        this.approvedCars = data.json();
        console.log(data.json());
      },
      error => console.log(error)
    );

    this.http.get('http://localhost:7071/api/GetCars/rejected')
    .subscribe(
      data => {
        this.rejectedCars = data.json();
        console.log(data.json());
      },
      error => console.log(error)
    );

    this.http.get('http://localhost:7071/api/GetCars/pending')
    .subscribe(
      data => {
        this.pendingCars = data.json();
        console.log(data.json());
      },
      error => console.log(error)
    );
  }

  gotoDetail(): void {
    this.router.navigate(['/detail']);
  }


}
