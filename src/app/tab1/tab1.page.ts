// src/app/tab1/tab1.page.ts

import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

// IMPORTAR AQUI la clase de tu componente de Historial
import { HistorialPage } from '../pages/historial/historial.page'; // Ajusta esta ruta si es necesario

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  // AÑADIR HistorialPage a la lista de imports para poder usar su selector en el HTML
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HistorialPage], 
})
export class Tab1Page {
  constructor() {}
}