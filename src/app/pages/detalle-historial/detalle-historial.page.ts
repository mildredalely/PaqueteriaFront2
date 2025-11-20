import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Envio {
  numero: string;
  fecha: string;
  remitente: string;
  destinatario: string;
  estado: 'recibido' | 'enviado' | 'en-transito' | 'completado';
}

@Component({
  selector: 'app-detalle-historial',
  templateUrl: './detalle-historial.page.html',
  styleUrls: ['./detalle-historial.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetalleHistorialPage implements OnInit {

  envio: Envio | null = null;

  constructor(private router: Router) {
    // Obtener los datos enviados desde la página anterior
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.envio = navigation.extras.state['envio'];
    }
  }

  ngOnInit() {
  }

  volver() {
    this.router.navigate(['/historial']);
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
}