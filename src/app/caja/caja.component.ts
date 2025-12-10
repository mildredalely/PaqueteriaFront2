import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { jsPDF } from 'jspdf';

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
  datosRecibidos: any = null;

  constructor(
    private router: Router, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    addIcons({ arrowBackCircleOutline });
  }

  ionViewWillEnter() {
    this.cargarDatosDelReporte();
  }

  ngOnInit() {}

  cargarDatosDelReporte() {
    const datosGuardados = localStorage.getItem('datosCierre');
    if (datosGuardados) {
      this.datosRecibidos = JSON.parse(datosGuardados);
      this.totalEsperado = this.datosRecibidos.total || 0;
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

  // --- BOTÓN PRINCIPAL ---
  async cerrarTurno() {
    if (this.efectivoCaja === null) {
      return this.showAlert("Campo vacío", "Por favor ingresa el efectivo en caja.");
    }

    if (Math.abs(this.diferencia) > 1) {
      return this.showAlert("⚠ Descuadre", `El efectivo no coincide. Diferencia: $${this.diferencia.toFixed(2)}`);
    }

    // Alerta de confirmación cambiada para PDF
    const alert = await this.alertCtrl.create({
      header: "Caja Correcta ",
      message: "¿Deseas descargar el reporte PDF y cerrar el turno?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        { 
          text: "Descargar y Cerrar", 
          handler: () => this.generarYDescargarPDF() 
        }
      ]
    });

    await alert.present();
  }


  async generarYDescargarPDF() {
    const loading = await this.loadingCtrl.create({ message: 'Generando PDF...' });
    await loading.present();

    try {
      const doc = new jsPDF();
      const margenIzq = 20;
      let y = 20; // Posición vertical (eje Y), irá aumentando para bajar de renglón

      // --- ENCABEZADO ---
      doc.setFontSize(18);
      doc.setTextColor(14, 107, 168); // Azul corporativo (RGB)
      doc.text("REPORTE DE CIERRE DE CAJA", 105, y, { align: "center" }); // 105 es el centro de la hoja
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha de impresión: ${new Date().toLocaleString()}`, 105, y, { align: "center" });
      y += 15;

      // Línea separadora
      doc.setDrawColor(200);
      doc.line(margenIzq, y, 190, y);
      y += 10;

      // --- DETALLE DEL SISTEMA ---
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Resumen del Sistema", margenIzq, y);
      y += 10;

      doc.setFontSize(12);
      // Función auxiliar para escribir filas rápido
      const fila = (label: string, valor: string) => {
        doc.text(label, margenIzq, y);
        doc.text(valor, 190, y, { align: "right" }); // Alineado a la derecha
        y += 8;
      };

      fila("Pedidos Totales:", `${this.datosRecibidos?.pedidos || 0}`);
      fila("Ingresos Registrados:", `$ ${Number(this.datosRecibidos?.ingresos || 0).toFixed(2)}`);
      fila("Salidas/Gastos:", `- $ ${Number(this.datosRecibidos?.salidas || 0).toFixed(2)}`);
      
      y += 5;
      doc.setFont('helvetica', 'bold'); // Negritas
      fila("TOTAL ESPERADO:", `$ ${this.totalEsperado.toFixed(2)}`);
      doc.setFont('helvetica', 'normal'); // Normal

      y += 10;
      doc.line(margenIzq, y, 190, y);
      y += 10;

      // --- VALIDACIÓN DE CAJA ---
      doc.setFontSize(14);
      doc.text("Arqueo de Caja (Real)", margenIzq, y);
      y += 10;

      doc.setFontSize(12);
      fila("Efectivo Reportado:", `$ ${(this.efectivoCaja || 0).toFixed(2)}`);
      
      // Color condicional para la diferencia
      if (this.diferencia === 0) {
        doc.setTextColor(0, 128, 0); // Verde
        fila("Estado:", "CUADRADO PERFECTO");
      } else {
        doc.setTextColor(255, 0, 0); // Rojo
        fila("Diferencia:", `$ ${this.diferencia.toFixed(2)}`);
      }

      const nombreArchivo = `Cierre_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
      doc.save(nombreArchivo);

      await loading.dismiss();

      // --- FINALIZAR PROCESO ---
      const alert = await this.alertCtrl.create({
        header: "¡Descargado! ",
        message: "El PDF se ha guardado en tu dispositivo.",
        buttons: [{
          text: "Salir al Login",
          handler: () => {
            localStorage.removeItem('datosCierre');
            this.router.navigate(['/login']);
          }
        }]
      });
      await alert.present();

    } catch (error) {
      await loading.dismiss();
      console.error(error);
      this.showAlert("Error", "No se pudo generar el PDF.");
    }
  }

  async showAlert(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({ header: titulo, message: mensaje, buttons: ["OK"] });
    await alert.present();
  }
}