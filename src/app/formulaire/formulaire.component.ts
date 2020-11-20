import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component'

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent implements OnInit {

alerts: any[] = [{
  type: '',
  msg: '',
  timeout: 1}];
nom: string = '';
prenom: string = '';
telephone: number;
listeRegions: any;
regionChoisi: any = {code:'', nom:''};
listeForm: any[] = [{
  nom: '',
  prenom: '',
  tel: 0,
  region: ''
}];
listeSave: any[] = JSON.parse(localStorage.getItem('listeTableau'));
fakeList: any[] = [{
  nom: '',
  prenom: '',
  tel: 0,
  region: ''
}];
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('https://geo.api.gouv.fr/regions')
    .subscribe(data => {this.listeRegions = data;
    console.log(data);
    console.log(this.listeRegions)});

    this.listeForm.splice(0, 1);
    this.fakeList.splice(0 , 1);
    console.log(this.listeSave);
    this.listeForm = this.listeSave;
    
    this.fakeList.push({nom: 'H', prenom: 'Bob', tel: 1111111111, region: 'Paris'});
    this.fakeList.push({nom: 'I', prenom: 'Rob', tel: 2222222222, region: 'Paris'});
    this.fakeList.push({nom: 'Z', prenom: 'Robert', tel: 333333333, region: 'Paris'});
    this.fakeList.push({nom: 'A', prenom: 'Booba', tel: 4444444444, region: 'Paris'});
    this.fakeList.push({nom: 'D', prenom: 'Bobby', tel: 5555555555, region: 'Paris'});
    this.fakeList.sort();

  }

  validerSaisie() {
    // this.alerts.push({
    //   type: "warning",
    //   msg: "le bouton fonctionne",
    //   timeout: 5000});
    if ( this.nom !== '' && this.prenom !== '' && this.regionChoisi !== undefined ) {
      if (this.listeForm.length === 0) {
        this.listeForm.push ({nom: this.nom, prenom: this.prenom, tel: this.telephone, region: this.regionChoisi.code+' - '+this.regionChoisi.nom});
        console.log(this.listeForm[0]);
      } else {
        let ajoutFait = false;
        for (let i=0; i < this.listeForm.length; i++) {
          console.log(this.nom.localeCompare(this.listeForm[0].nom))
          if (this.nom.localeCompare(this.listeForm[i].nom) === -1 ) {
            this.listeForm.splice(i, 0, {nom: this.nom, prenom: this.prenom, tel: this.telephone, region: this.regionChoisi.code+' - '+this.regionChoisi.nom});
            ajoutFait = true;
            break;
          }
        }
        if (ajoutFait === false) {
          this.listeForm.push ({nom: this.nom, prenom: this.prenom, tel: this.telephone, region: this.regionChoisi.code+' - '+this.regionChoisi.nom});
        }
      }
    }
    console.log(this.listeForm);
    this.listeSave = this.listeForm;
    localStorage.setItem('listeTableau', JSON.stringify(this.listeSave));
  }

  onClosed(dismissedAlert: AlertComponent) {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
