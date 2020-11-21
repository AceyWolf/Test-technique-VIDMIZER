import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent implements OnInit {

modalRef: BsModalRef;  //Permet l'utilisation des modals (utilisé pour confirmer la suppression d'une ligne du tableau)
alerts: any[] = [{    // Sert pour l'affichage des messages d'erreur
  type: '',
  msg: '',
  timeout: 1}];
recherche: string = ''; // Servira lors de la recherche d'une ligne sur le tableau
listeRegions: any;    // Contiendra toutes les régions
listeForm: any[] = [{      //Correspond a la liste qui permettra d'établir le tableau
  nom: '',
  prenom: '',
  tel: '',
  region: ''
}];
listeSave: any[] = JSON.parse(localStorage.getItem('listeTableau')); //Récupère les données stockées localement
index: number;
nomSuppr: string; //Stockera le nom prenom de la ligne du tableau a supprimer pour l'afficher dans le modal
prenomSuppr: string;

  constructor(private httpClient: HttpClient, private modalService: BsModalService) { }

  ngOnInit() {
    this.httpClient.get('https://geo.api.gouv.fr/regions')   //Récupère les régions à partir de l'API
    .subscribe(data => {this.listeRegions = data});

    this.listeForm.splice(0, 1); // Supprime le premier élément déclaré lors de l'initialisation afin de s'assurer d'avoir un tableau vide
    this.listeForm = this.listeSave; // Copie les élements stockées localement dans la liste utilisé pour le tableau
  }

  validerSaisie(form: NgForm) { // Lorsque l'utilisateur valide la saisie du formulaire
      if (this.listeForm.length === 0) { // Si le tableau est vide, on ajoute directement la saisie et vide les champs du formulaire 
        this.listeForm.push ({nom: form.value['nom'], prenom: form.value['prenom'], tel: form.value['telephone'], region: form.value['region']});
        form.reset();
      } else { // Si le tableau contient deja des éléments
        let ajoutFait = false; // variable qui permet de s'assurer que les ajouts se fassent qu'une seule fois ou bien pas du tout en cas d'erreur
        for (let i=0; i < this.listeForm.length; i++) { // Parcout l'intégralité du tableau
          if (form.value['telephone'].localeCompare(this.listeForm[i].tel) === 0) { // Si le numéro saisie est déja présent dans le tableau, on affiche un message d'erreur de 5 secondes
            this.alerts.push({
              type: "warning",
              msg: "Ce numéro est déjà présent dans le tableau",
              timeout: 5000});
            ajoutFait =true;
            break;
          } else { // Sinon on passe à la vérification du nom/prenom (Les comparaisons prennent pas en compte les majuscules et accent, donc Léo et leO sont considéré comme identiques)
              if (form.value['nom'].localeCompare(this.listeForm[i].nom, undefined, {sensitivity: 'base'}) === -1 ) { // Si le nom saisie est alphabétiquement avant la ligne du tableau comparé, on l'ajoute et reinitialise le formulaire
                this.listeForm.splice(i, 0, {nom: form.value['nom'], prenom: form.value['prenom'], tel: form.value['telephone'], region: form.value['region']});
                ajoutFait = true;
                form.reset();
                break;
              } else if (form.value['nom'].localeCompare(this.listeForm[i].nom, undefined, {sensitivity: 'base'}) === 0) { // Sinon si le nom saisie est identique à la ligne du tableau, on compare cette fois le prenom pour verifier s'il s'agit d'un doublon
                  if (form.value['prenom'].localeCompare(this.listeForm[i].prenom, undefined, {sensitivity: 'base'}) === 0) { // S'il s'agit bien d'un doublon, on affiche un message d'erreur de 5 secondes
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
        if (ajoutFait === false) { // Si après toutes les vérifications, on ne trouve aucun doublon ou bien que le nom est se place en dernier alphabétiquement, on l'ajoute au tableau et reinitialise le formulaire
          this.listeForm.push ({nom: form.value['nom'], prenom: form.value['prenom'], tel: form.value['telephone'], region: form.value['region']});
          form.reset();
        }
      }
    this.listeSave = this.listeForm; // Copie le nouveau contenu du tableau à la liste qui permet la sauvegarde locale et effectue la sauvegarde
    localStorage.setItem('listeTableau', JSON.stringify(this.listeSave));
  }

  openModal(template: TemplateRef<any>, index: number) { // Ouvre le modal de confirmation et garde l'index de la ligne de tableau concerné pour la suppression
    this.index = index;
    this.nomSuppr = this.listeForm[index].nom; 
    this.prenomSuppr = this.listeForm[index].prenom;
    this.modalRef = this.modalService.show(template);
  }

  Suppression() { // Permet de supprimer une ligne du tableau
    this.listeForm.splice(this.index, 1);
    this.listeSave = this.listeForm; // Copie le nouveau contenu du tableau à la liste qui permet la sauvegarde locale et effectue la sauvegarde
    localStorage.setItem('listeTableau', JSON.stringify(this.listeSave));
    this.modalRef.hide();  // Cache le modal de confirmation
  }

  onClosed(dismissedAlert: AlertComponent) { // Necessaire pour faire disparaitre les messages d'erreur après le temps d'affichage indiqué
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}