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
    // Petición GET al backend
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (listaEnvios) => {
        // 1. Obtener la fecha de hoy en formato texto (YYYY-MM-DD) para comparar
        // Nota: .split('T')[0] nos da solo la parte de la fecha, ignorando la hora
        const hoyString = new Date().toISOString().split('T')[0]; 

        // 2. Filtrar: Nos quedamos solo con los envíos que coincidan con la fecha de hoy
        const enviosDeHoy = listaEnvios.filter(envio => {
          // Buscamos el campo de fecha. Si tu base de datos usa 'createdAt', 'fecha_envio', etc.
          // El backend suele devolver fechas en formato ISO: "2023-12-04T10:30:00.000Z"
          const fechaRegistro = envio.fecha_envio || envio.createdAt || envio.created_at || '';
          return fechaRegistro.toString().startsWith(hoyString);
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