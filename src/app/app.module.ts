import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { AlertModule, AlertConfig } from 'ngx-bootstrap/alert'
import { ModalModule } from 'ngx-bootstrap/modal'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormulaireComponent } from './formulaire/formulaire.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DigitOnlyModule } from '@uiowa/digit-only' 

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
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    DigitOnlyModule
  ],
  providers: [AlertConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
