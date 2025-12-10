import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { shareOutline, closeOutline, downloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Vista Previa</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-no-padding">
      <div class="pdf-container" *ngIf="pdfSrc">
        <iframe [src]="pdfSrc" type="application/pdf" width="100%" height="100%" frameborder="0"></iframe>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button expand="block" (click)="compartir()" shape="round" class="ion-margin" color="success">
          <ion-icon slot="start" name="share-outline"></ion-icon>
          Compartir / Guardar
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [`
    .pdf-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #525659; /* Color de fondo típico de visores PDF */
    }
    iframe {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class PdfPreviewComponent implements OnInit {
  @Input() pdfBlob: Blob | null = null;
  @Input() fileName: string = 'documento.pdf';
  
  pdfSrc: SafeResourceUrl | null = null;

  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer
  ) {
    addIcons({ shareOutline, closeOutline, downloadOutline });
  }

  ngOnInit() {
    if (this.pdfBlob) {
      // Convertimos el archivo en memoria a una URL segura
      const url = URL.createObjectURL(this.pdfBlob);
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async compartir() {
    if (!this.pdfBlob) return;

    const file = new File([this.pdfBlob], this.fileName, { type: 'application/pdf' });

    // 1. Intenta compartir nativamente (Celulares)
    if (navigator.share) {
      try {
        await navigator.share({
          files: [file],
          title: 'Cierre de Caja',
          text: 'Adjunto el reporte de cierre.',
        });
      } catch (error) {
        console.log('Compartir cancelado', error);
      }
    } else {
      // 2. Si es PC, descarga el archivo
      const url = window.URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}