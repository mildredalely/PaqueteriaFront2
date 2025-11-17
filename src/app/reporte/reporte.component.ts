import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonCardContent, IonCardTitle, IonContent, IonToolbar } from "@ionic/angular/standalone";
import {  CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from "../components/footer/footer.component";
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  imports: [IonicModule, CommonModule, FooterComponent],
  styleUrls: ['./reporte.component.scss'],
})
export class ReporteComponent  implements OnInit {
reportes = [
    {
      empleado: 'Mildred',
      pedidos: 15,
      ingresos: 2500,
      salidas: 500,
      total: 2000
    },
  ];
  // reportes.reduce es una funcion que permite iterar sobre un arreglo y acumular un valor
  get totalDia(): number {
    return this.reportes.reduce((acc, turno) => acc + turno.total, 0);
  }
  constructor(private router: Router) { }
 imprimir() {
    
    localStorage.setItem('totalDia', this.totalDia.toString());
    this.router.navigate(['caja']);
  }
  ngOnInit() {}

}
