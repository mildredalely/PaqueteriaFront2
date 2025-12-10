import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [IonicModule, FormsModule, FooterComponent, CommonModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss'],
})
export class CajaComponent implements OnInit {

  efectivoCaja: number | null = null;
  totalEsperado: number = 0;
  correo: string = '';
  
  datosRecibidos: any = null;

  constructor(private router: Router, private alertCtrl: AlertController) {
    addIcons({ arrowBackCircleOutline });
  }

  ngOnInit() {
    
  }


  // Esta función se ejecuta CADA VEZ que entras a la pantalla
  ionViewWillEnter() {
    this.cargarDatosDelReporte();
  }

  cargarDatosDelReporte() {
    console.log(' Entrando a pantalla de Caja, leyendo datos...');
    const datosGuardados = localStorage.getItem('datosCierre');
    
    if (datosGuardados) {
      this.datosRecibidos = JSON.parse(datosGuardados);
      this.totalEsperado = this.datosRecibidos.total || 0;
      
      console.log("Datos actualizados:", this.totalEsperado);
    } else {
      this.totalEsperado = 0;
    }
  }

  volver() {
    this.router.navigate(['/reporte']);
  }

  get diferencia(): number {
    return (this.efectivoCaja || 0) - this.totalEsperado;
  }

  async cerrarTurno() {
    if (this.efectivoCaja === null) {
      return this.showAlert("Campo vacío", "Por favor ingresa cuánto efectivo tienes en caja.");
    }

    if (Math.abs(this.diferencia) > 1) {
      return this.showAlert("⚠ Descuadre de Caja", `El efectivo no coincide. Tienes una diferencia de $${this.diferencia.toFixed(2)}`);
    }

    if (!this.correo || !this.correo.includes('@')) {
      return this.showAlert("Correo inválido", "Ingresa un correo válido para enviar el reporte.");
    }

    const alert = await this.alertCtrl.create({
      header: "Caja Cuadrada ",
      message: `El monto coincide correctamente. ¿Enviar reporte a ${this.correo}?`,
      cssClass: "alerta-animada",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        { text: "Enviar", handler: () => this.enviarCorreo() }
      ]
    });

    await alert.present();
  }

 async enviarCorreo() {
    // Simulación de envío
    console.log("Enviando reporte completo a:", this.correo);
    
    // Creamos una alerta personalizada con navegación
    const alert = await this.alertCtrl.create({
      header: "Éxito",
      message: "Reporte enviado y turno cerrado correctamente.",
      buttons: [
        {
          text: "OK",
          handler: () => {
           
            localStorage.removeItem('datosCierre');

           
            this.router.navigate(['/login']); 
          }
        }
      ]
    });

    await alert.present();
  }

  async showAlert(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ["OK"]
    });
    await alert.present();
  }
}