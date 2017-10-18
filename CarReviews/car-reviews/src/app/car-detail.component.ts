import { Component } from '@angular/core';
import { Car } from './car';
import { Http, Headers, RequestOptions } from '@angular/http';
declare const Buffer;
import * as fs from 'fs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './car-detail.component.html'
})
export class CarDetailComponent {
  title = 'Car Reviews';
  image = 'assets/noimage.jpg';
  car: Car;

 
  constructor(private http:Http) {
      this.car = new Car();
      this.car.name = "";
      this.car.company = "";
      this.car.description = "";
      this.car.image_url = "assets/noimage.jpg";
      this.car.state = "pending";
  }

  executeUpload(base64encoded: string, filename: string) {

    let headers = new Headers();
    
    let options = new RequestOptions({
      headers: headers
    });
    let data = {filename: filename, data: base64encoded }
    let url = environment.fileUploadUrl.replace(/\{filename\}/, filename);
    this.http.post(encodeURI(url), data, options)
    .subscribe(
      data => console.log(data),
      error => console.log(error)
    );
      this.car.image_url = encodeURI(environment.imageBlobUrl + filename);
      
    this.image = base64encoded;
   console.log("File encoded");
  }


  upload(list: any) {
    if (list.length <= 0) { return; }

    let f = list[0];
    let reader = new FileReader();
    let self = this;
    reader.addEventListener("load", function() {
      let base64encoded = reader.result;
      self.executeUpload(base64encoded, f.name);
    }, false);

    if (f) {
      reader.readAsDataURL(f);
    }
  }

  submit() {

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    let options = new RequestOptions({
      headers: headers
    });
    let requestObject = {"properties": null, "type": "object"}
    requestObject.properties = this.car;
    console.log(JSON.stringify(this.car));
    let data = this.car;
    this.http.post(environment.createCarUrl, data, options)
    .subscribe(
      data => console.log(data),
      error => console.log(error)
    );
  }

}


