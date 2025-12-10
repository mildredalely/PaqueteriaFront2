import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBackCircleOutline, documentTextOutline } from 'ionicons/icons';
import { jsPDF } from 'jspdf';
import { PdfPreviewComponent } from '../components/pdf-preview/pdf-preview.component'; // <--- VERIFICA ESTA RUT

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
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {
    addIcons({ arrowBackCircleOutline, documentTextOutline });
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

    const alert = await this.alertCtrl.create({
      header: "Caja Correcta",
      message: "¿Generar reporte y visualizar?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        { 
          text: "Generar", 
          handler: () => this.generarYPrevisualizarPDF() 
        }
      ]
    });

    await alert.present();
  }

  async generarYPrevisualizarPDF() {
    const loading = await this.loadingCtrl.create({ message: 'Generando vista previa...' });
    await loading.present();

    try {
      const doc = new jsPDF();
      const margenIzq = 20;
      let y = 20;

      // --- DISEÑO DEL PDF ---
      doc.setFontSize(18);
      doc.setTextColor(14, 107, 168);
      doc.text("REPORTE DE CIERRE DE CAJA", 105, y, { align: "center" });
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Fecha de impresión: ${new Date().toLocaleString()}`, 105, y, { align: "center" });
      y += 15;

      doc.setDrawColor(200);
      doc.line(margenIzq, y, 190, y);
      y += 10;

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Resumen del Sistema", margenIzq, y);
      y += 10;

      doc.setFontSize(12);
      const fila = (label: string, valor: string) => {
        doc.text(label, margenIzq, y);
        doc.text(valor, 190, y, { align: "right" });
        y += 8;
      };

      fila("Pedidos Totales:", `${this.datosRecibidos?.pedidos || 0}`);
      fila("Ingresos Registrados:", `$ ${Number(this.datosRecibidos?.ingresos || 0).toFixed(2)}`);
      fila("Salidas/Gastos:", `- $ ${Number(this.datosRecibidos?.salidas || 0).toFixed(2)}`);
      
      y += 5;
      doc.setFont('helvetica', 'bold');
      fila("TOTAL ESPERADO:", `$ ${this.totalEsperado.toFixed(2)}`);
      doc.setFont('helvetica', 'normal');

      y += 10;
      doc.line(margenIzq, y, 190, y);
      y += 10;

      doc.setFontSize(14);
      doc.text("Arqueo de Caja (Real)", margenIzq, y);
      y += 10;

      doc.setFontSize(12);
      fila("Efectivo Reportado:", `$ ${(this.efectivoCaja || 0).toFixed(2)}`);
      
      if (this.diferencia === 0) {
        doc.setTextColor(0, 128, 0);
        fila("Estado:", "CUADRADO PERFECTO");
      } else {
        doc.setTextColor(255, 0, 0);
        fila("Diferencia:", `$ ${this.diferencia.toFixed(2)}`);
      }

      // --- FIN DISEÑO ---

      const nombreArchivo = `Cierre_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;

      // GENERAR BLOB (Archivo en memoria)
      const pdfBlob = doc.output('blob');

      await loading.dismiss();

      // ABRIR MODAL
      const modal = await this.modalCtrl.create({
        component: PdfPreviewComponent,
        componentProps: {
          pdfBlob: pdfBlob,
          fileName: nombreArchivo
        }
      });

      await modal.present();

      // Cuando se cierra el modal, preguntamos si quiere salir
      await modal.onDidDismiss();
      this.preguntarSalida();

    } catch (error) {
      await loading.dismiss();
      console.error(error);
      this.showAlert("Error", "No se pudo generar el PDF.");
    }
  }

  async preguntarSalida() {
    const alert = await this.alertCtrl.create({
      header: "Proceso finalizado",
      message: "¿Deseas cerrar sesión?",
      buttons: [
        { text: "No", role: "cancel" },
        { 
          text: "Sí, Salir", 
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
    const alert = await this.alertCtrl.create({ header: titulo, message: mensaje, buttons: ["OK"] });
    await alert.present();
  }
}