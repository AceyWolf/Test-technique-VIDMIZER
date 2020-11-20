import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { AlertModule, AlertConfig } from 'ngx-bootstrap/alert'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormulaireComponent } from './formulaire/formulaire.component';

@NgModule({
  declarations: [
    AppComponent,
    FormulaireComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [AlertConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
