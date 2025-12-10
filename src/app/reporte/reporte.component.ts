import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular'; // Importar LoadingController y AlertController
import { FooterComponent } from '../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Conection } from 'src/app/services/conection'; 

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterComponent, FormsModule, HttpClientModule],
})
export class ReporteComponent implements OnInit {

  // No necesitamos 'apiUrl' ni 'HttpClient' aquí, usamos el servicio 'Conection'

  // Datos para mostrar en pantalla
  fechaHoy: Date = new Date();

  pedidos: number = 0;
  ingresos: number = 0;
  salidas: number = 0; 
  total: number = 0;

  constructor(
    private router: Router,
    private conectionService: Conection, 
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController 
  ) { }

  ngOnInit() {
    this.cargarEnviosDelDia();
  }

  async cargarEnviosDelDia() {
    const loading = await this.loadingCtrl.create({ message: 'Calculando reporte...' });
    await loading.present();

   
    this.conectionService.getEnvios().subscribe({
      
      next: (listaEnvios: any) => { 
        loading.dismiss();

       
        const enviosArray = Array.isArray(listaEnvios) ? listaEnvios : listaEnvios.data || [];
        
        const hoyString = new Date().toISOString().split('T')[0]; 

        // Filtrar envíos de hoy
        const enviosDeHoy = enviosArray.filter((envio: any) => {
          // Asegúrate que uno de estos campos exista en tus datos
          const fechaRegistro = envio.fecha_envio || envio.createdAt || envio.created_at || '';
          return fechaRegistro.toString().startsWith(hoyString);
        });

        // Asignamos los datos
        this.pedidos = enviosDeHoy.length;
        
        // Calculamos ingresos
        this.ingresos = enviosDeHoy.reduce((suma: number, envio: any) => {
          // Usamos 'precio_total' si es el campo correcto para el ingreso
          return suma + (Number(envio.precio_total) || 0);
        }, 0);

        this.calcularTotal();
      },
      error: (error: any) => {
        loading.dismiss();
        console.error('Error al cargar envíos:', error);
        this.showAlert('Error de Conexión', 'No se pudieron obtener los datos del servidor.');
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

  async showAlert(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({ header: titulo, message: mensaje, buttons: ["OK"] });
    await alert.present();
  }
}