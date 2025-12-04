import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer.component';
// Importamos HttpClient para conectar al backend directamente
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  standalone: true,
  // Importante: HttpClientModule debe estar aquí para que funcione la petición
  imports: [IonicModule, CommonModule, FooterComponent, FormsModule, HttpClientModule],
})
export class ReporteComponent implements OnInit {

  // Datos para mostrar en pantalla
  empleado: string = 'Mildred';
  fechaHoy: Date = new Date();

  pedidos: number = 0;
  ingresos: number = 0;
  salidas: number = 0; 
  total: number = 0;

  // URL directa a tu backend en Railway
  private apiUrl = 'https://paqueteriaback-production.up.railway.app/envios';

  constructor(
    private router: Router,
    private http: HttpClient // Inyectamos el cliente HTTP
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
          const fechaRegistro = envio.fecha || envio.createdAt || envio.created_at || '';
          return fechaRegistro.toString().startsWith(hoyString);
        });

        // 3. Contar cuántos pedidos hubo hoy
        this.pedidos = enviosDeHoy.length;

        // 4. Sumar el dinero (campo precio_total)
        this.ingresos = enviosDeHoy.reduce((suma, envio) => {
          return suma + (Number(envio.precio_total) || 0);
        }, 0);

        // 5. Calcular el balance inicial
        this.calcularTotal();
      },
      error: (error) => {
        console.error('Error al conectar con el servidor:', error);
        // Opcional: Mostrar un mensaje si falla
      }
    });
  }

  // Se ejecuta cada vez que cambias el valor de "Salidas"
  calcularTotal() {
    this.total = this.ingresos - this.salidas;
  }

  imprimir() {
    // Preparamos todos los datos para enviarlos a la pantalla de Caja (PDF)
    const datosParaReporte = {
      empleado: this.empleado,
      fecha: new Date().toISOString(),
      pedidos: this.pedidos,
      ingresos: this.ingresos,
      salidas: this.salidas,
      total: this.total
    };

    // Guardamos en la memoria del teléfono/navegador
    localStorage.setItem('datosCierre', JSON.stringify(datosParaReporte));
    
    // Navegamos a la pantalla de cierre de caja
    this.router.navigate(['caja']);
  }
}