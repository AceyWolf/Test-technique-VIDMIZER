import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms'
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
nom: string;
prenom: string;
telephone: string;
regionChoisi: any = {code: '', nom:''};
recherche: string = '';
listeRegions: any;
listeForm: any[] = [{
  nom: '',
  prenom: '',
  tel: '',
  region: ''
}];
listeSave: any[] = JSON.parse(localStorage.getItem('listeTableau'));

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('https://geo.api.gouv.fr/regions')
    .subscribe(data => {this.listeRegions = data;
    console.log(data);
    console.log(this.listeRegions)});

    this.listeForm.splice(0, 1);
    console.log(this.listeSave);
    this.listeForm = this.listeSave;

  }

  validerSaisie(form: NgForm) {
      if (this.listeForm.length === 0) {
        this.listeForm.push ({nom: form.value['nom'], prenom: form.value['prenom'], tel: form.value['telephone'], region: form.value['region']});
        form.reset();
      } else {
        let ajoutFait = false;
        for (let i=0; i < this.listeForm.length; i++) {
          if (form.value['telephone'].localeCompare(this.listeForm[i].tel) === 0) {
            this.alerts.push({
              type: "warning",
              msg: "Ce numéro est déjà présent dans le tableau",
              timeout: 5000});
              ajoutFait =true;
              break;
          } else {
              if (form.value['nom'].localeCompare(this.listeForm[i].nom) === -1 ) {
                this.listeForm.splice(i, 0, {nom: form.value['nom'], prenom: form.value['prenom'], tel: form.value['telephone'], region: form.value['region']});
                ajoutFait = true;
                form.reset();
                break;
              } else if (form.value['nom'].localeCompare(this.listeForm[i].nom) === 0) {
                if (form.value['prenom'].localeCompare(this.listeForm[i].prenom) === 0) {
                  this.alerts.push({
                      type: "warning",
                      msg: "Cette personne est déjà présente dans le tableau",
                      timeout: 5000});
                      ajoutFait =true;
                      break;
                }
              }
            }
        }
        if (ajoutFait === false) {
          this.listeForm.push ({nom: form.value['nom'], prenom: form.value['prenom'], tel: form.value['telephone'], region: form.value['region']});
          form.reset();
        }
      }
    console.log(this.listeForm);
    this.listeSave = this.listeForm;
    localStorage.setItem('listeTableau', JSON.stringify(this.listeSave));
  }

  Suppression(index: number) {
    console.log(index);
    this.listeForm.splice(index, 1);
    this.listeSave = this.listeForm;
    localStorage.setItem('listeTableau', JSON.stringify(this.listeSave));
    
  }

  onClosed(dismissedAlert: AlertComponent) {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
