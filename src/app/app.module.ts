import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import { MaterialModule } from './material/material.module';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxMathFunctionPlotterModule} from "ngx-math-function-plotter";
//import { PlotlyViaWindowModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMathFunctionPlotterModule,
    PlotlyModule
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule { }
