import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonImg, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonLabel, IonImg,  CommonModule, FormsModule, RouterLink]
})
export class RegistrarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
