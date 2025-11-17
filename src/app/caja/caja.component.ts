import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer.component';
@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [IonicModule, FormsModule, FooterComponent],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss'],
})
export class CajaComponent implements OnInit {

  efectivoCaja: number | null = null;
  totalEsperado: number = 0;
  correo: string = '';
  

  constructor(private router: Router,private alertCtrl: AlertController) {}

    ngOnInit() {
    this.totalEsperado = Number(localStorage.getItem('totalDia')) || 0;
  }

  volver() {
    this.router.navigate(['/tab3']);
  }

  async cerrarTurno() {
    if (this.efectivoCaja === null) {
      return this.showAlert("Error", "Ingresa el efectivo en caja.");
    }

    if (this.efectivoCaja !== this.totalEsperado) {
      return this.showAlert("Advertencia", "El efectivo no coincide con el total del día.");
    }

    if (!this.correo) {
      return this.showAlert("Error", "Ingresa un correo válido.");
    }

    const alert = await this.alertCtrl.create({
      header: "Confirmar envío",
      message: "¿Deseas enviar el reporte de cierre?",
      cssClass: "alerto-animado",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        { text: "Enviar", handler: () => this.enviarCorreo() }
      ]
    });

    await alert.present();
  }

  enviarCorreo() {
    console.log("Enviando correo...", this.correo);
    this.showAlert("Éxito", "Reporte enviado correctamente.");
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
