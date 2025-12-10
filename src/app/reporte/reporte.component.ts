import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../components/footer/footer.component';
import { FormsModule } from '@angular/forms';

import { Conection } from 'src/app/services/conection'; 

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterComponent, FormsModule],
})
export class ReporteComponent implements OnInit {

  // Datos para mostrar en pantalla
  fechaHoy: Date = new Date();

  pedidos: number = 0;
  ingresos: number = 0;
  salidas: number = 0; 
  total: number = 0;

  constructor(
    private router: Router,
    // 2. Inyectamos tu servicio en lugar de usar HttpClient directamente aquí
    private conectionService: Conection 
  ) { }

  ngOnInit() {
    this.cargarEnviosDelDia();
  }


cargarEnviosDelDia() {
    this.conectionService.getEnvios().subscribe({
      next: (listaEnvios: any[]) => {
        
        // Obtenemos la fecha de HOY en formato local
        const fechaHoyLocal = new Date().toLocaleDateString(); 

        const enviosDeHoy = listaEnvios.filter((envio: any) => {
          // Validamos que exista la fecha
          const fechaString = envio.fecha_envio || envio.created_at || envio.fecha;
          if (!fechaString) return false;

          // Convertimos y comparamos
          const fechaEnvioLocal = new Date(fechaString).toLocaleDateString();
          return fechaEnvioLocal === fechaHoyLocal;
        });

        // Asignamos los datos
        this.pedidos = enviosDeHoy.length;
        
        this.ingresos = enviosDeHoy.reduce((suma: number, envio: any) => {
          return suma + (Number(envio.precio_total) || 0);
        }, 0);

        this.calcularTotal();
      },
      error: (error) => {
        console.error('Error al cargar envíos:', error);
      }
    });
  }



  calcularTotal() {
    this.total = this.ingresos - this.salidas;
  }

  imprimir() {
    const datosParaReporte = {
      fecha: new Date().toISOString(),
      pedidos: this.pedidos,
      ingresos: this.ingresos,
      salidas: this.salidas,
      total: this.total
    };

    localStorage.setItem('datosCierre', JSON.stringify(datosParaReporte));
    this.router.navigate(['caja']);
  }
}