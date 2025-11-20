// src/app/tab1/tab1.page.ts

import { Component } from '@angular/core';
import { IonImg, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButton, IonInput, IonLabel, IonImg, IonSelect, IonSelectOption, FooterComponent],
})
export class Tab1Page {
  step = 1;

  products =[
    { nombre: 'Tortillas', peso: 20, costo: 200, fragil: true },
    { nombre: 'Jitomates', peso: 10, costo: 100, fragil: false },
    { nombre: 'Aguacates', peso: 15, costo: 150, fragil: true },
    { nombre: 'Cebollas', peso: 8, costo: 80, fragil: false },
    { nombre: 'Chiles', peso: 5, costo: 50, fragil: true }
  ]
  nextStep(){
    this.step += 1;
    if(this.step > 5){
      this.step = 1;
    }
  }

  agregarProducto(){
    this.products.push({ nombre: 'Nuevo Producto', peso: 0, costo: 0, fragil: false });
  }
}
