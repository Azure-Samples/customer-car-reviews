import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';

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

  constructor(private router: Router, private http: Http) {
    console.log('constructor');
    this.approvedCars = JSON.parse(localStorage.getItem("approvedCars")) || [];
    this.rejectedCars = JSON.parse(localStorage.getItem("rejectedCars")) || [];
    this.pendingCars = JSON.parse(localStorage.getItem("pendingCars")) || [];
  }
  
  ngOnInit(): void {

    let headers = new Headers();
    
    let options = new RequestOptions({
      headers: headers
    });
    let url = environment.getCarsUrl.replace(/\{state\}/, 'approved')
    this.http.get(url)
    .subscribe(
      data => {
        this.approvedCars = data.json();
        localStorage.setItem('approvedCars', JSON.stringify(data.json()));
        console.log(data.json());
      },
      error => {
        this.approvedCars = [];
        localStorage.setItem('approvedCars', "[]");
        console.log(error);
      }
    );
    url = environment.getCarsUrl.replace(/\{state\}/, 'rejected')
    this.http.get(url)
    .subscribe(
      data => {
        this.rejectedCars = data.json();
        localStorage.setItem('rejectedCars', JSON.stringify(data.json()));
        console.log(data.json());
      },
      error => {
        this.rejectedCars = [];
        localStorage.setItem('rejectedCars', "[]");
        console.log(error);
      }
    );
    url = environment.getCarsUrl.replace(/\{state\}/, 'pending')
    this.http.get(url)
    .subscribe(
      data => {
        this.pendingCars = data.json();
        localStorage.setItem('pendingCars', JSON.stringify(data.json()));
        console.log(data.json());
      },
      error => {
        this.pendingCars = [];
        localStorage.setItem('pendingCars', "[]");
        console.log(error);
      }
    );
  }

  gotoDetail(): void {
    this.router.navigate(['/detail']);
  }


}
