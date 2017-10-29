import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ImageUploadModule } from 'angular2-image-upload';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { CarDetailComponent, ConfirmDialog } from './car-detail.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    CarDetailComponent,
    DashboardComponent,
    ConfirmDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ImageUploadModule.forRoot(),
  ],
  entryComponents: [
    ConfirmDialog
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
