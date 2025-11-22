import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FooterComponent } from "src/app/components/footer/footer.component";

interface Envio {
  numero: string;
  fecha: string;
  remitente: string;
  destinatario: string;
  estado: 'recibido' | 'enviado' | 'en-transito' | 'completado';
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FooterComponent]
})
export class HistorialPage implements OnInit {

  currentIndex = 0;

  envios: Envio[] = [
    {
      numero: 'Envío 1',
      fecha: '25/sep/2025',
      remitente: 'José Luis Gardenillas\nPorfirio Díaz #24\nSan Pablo Huixtepec',
      destinatario: 'Miriam Belén Santiago\nAlguna dirección de EU\nTexas',
      estado: 'completado'
    },
    {
      numero: 'Envío 2',
      fecha: '20/oct/2025',
      remitente: 'María González\nReforma #123\nOaxaca Centro',
      destinatario: 'Carlos Méndez\nMain Street 456\nCalifornia',
      estado: 'en-transito'
    },
    {
      numero: 'Envío 3',
      fecha: '15/oct/2025',
      remitente: 'Pedro Martínez\nIndependencia #89\nZaachila',
      destinatario: 'Ana López\nBroadway 789\nNueva York',
      estado: 'enviado'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  nextSlide() {
    if (this.currentIndex < this.envios.length - 1) {
      this.currentIndex++;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  getEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'recibido': 'Recibido',
      'enviado': 'Enviado',
      'en-transito': 'En Tránsito',
      'completado': 'Completado'
    };
    return estados[estado] || estado;
  }

  getEstadoClass(estado: string): string {
    return `estado-${estado}`;
  }

  verDetalle(envio: Envio) {
    // Navegar a la página de detalles pasando el objeto envio como parámetro
    this.router.navigate(['/detalle-historial'], { 
      state: { envio: envio } 
    });
  }
}