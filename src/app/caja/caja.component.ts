import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [IonicModule, FormsModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss'],
})
export class CajaComponent implements OnInit {

  efectivoCaja: number | null = null;
  totalEsperado: number = 0;
  correo: string = '';

  constructor(private router: Router, private alertCtrl: AlertController) {}

  ngOnInit() {
    // RECUPERAR EL DATO: Leemos lo que guardó la pantalla de Reporte
    const totalGuardado = localStorage.getItem('totalDia');
    
    // Si existe, lo convertimos a número, si no, es 0
    this.totalEsperado = totalGuardado ? Number(totalGuardado) : 0;
    
    console.log("Total recibido del reporte:", this.totalEsperado);
  }

  volver() {
    this.router.navigate(['/reporte']); // Ajusta la ruta si es necesario
  }

  // Esta función calcula la diferencia para mostrarla en pantalla
  get diferencia(): number {
    return (this.efectivoCaja || 0) - this.totalEsperado;
  }

  async cerrarTurno() {
    // 1. Validar que haya escrito algo
    if (this.efectivoCaja === null) {
      return this.showAlert("Campo vacío", "Por favor ingresa cuánto efectivo tienes en caja.");
    }

    // 2. VALIDACIÓN PRINCIPAL: ¿Coinciden los montos?
    // Usamos Math.abs() < 1 para permitir diferencias de centavos insignificantes
    if (Math.abs(this.diferencia) > 1) {
      return this.showAlert("⚠ Descuadre de Caja", `El efectivo no coincide. Tienes una diferencia de $${this.diferencia.toFixed(2)}`);
    }

    // 3. Validar correo
    if (!this.correo || !this.correo.includes('@')) {
      return this.showAlert("Correo inválido", "Ingresa un correo válido para enviar el reporte.");
    }

    // 4. Confirmación de éxito
    const alert = await this.alertCtrl.create({
      header: "Caja Cuadrada ",
      message: `El monto coincide correctamente. ¿Enviar reporte a ${this.correo}?`,
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
    this.showAlert("Éxito", "Reporte enviado y turno cerrado.");
    // Aquí podrías limpiar el localStorage y volver al inicio
    // localStorage.removeItem('totalDia');
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