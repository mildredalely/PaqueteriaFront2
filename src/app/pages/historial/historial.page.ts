import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa TODOS los componentes de Ionic que usas en la plantilla
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonButton 
} from '@ionic/angular/standalone';
interface Envio {
  fecha: string;
  remitente: {
    nombre: string;
    direccion: string;
  };
  destinatario: {
    nombre: string;
    direccion: string;
  };
  estado: string;
  productos?: {
    nombre: string;
    cantidad: number;
    peso: number;
    fragil: boolean;
  }[];
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonButton, 
    CommonModule, 
    FormsModule, 
    RouterOutlet,
    // ReplacePipe // Descomentar si usas un pipe personalizado para limpiar el estado
  ]
})
export class HistorialPage implements OnInit {
  router = inject(Router);

  envios: Envio[] = [
    {
      fecha: '25/sep/2023',
      remitente: {
        nombre: 'José Luis Gandarillas',
        direccion: 'Porfirio Díaz #24, San Pablo Huixtepec'
      },
      destinatario: {
        nombre: 'Miriam Belén Santiago',
        direccion: 'Alguna dirección de EU, Texas'
      },
      estado: 'Completado',
      productos: [
        { nombre: 'Producto 1', cantidad: 8, peso: 4, fragil: true },
        { nombre: 'Producto 2', cantidad: 2, peso: 1, fragil: false }
      ]
    },
    {
      fecha: '10/oct/2023',
      remitente: {
        nombre: 'María González López',
        direccion: 'Av. Juárez #156, Centro, Oaxaca'
      },
      destinatario: {
        nombre: 'Carlos Ramírez Torres',
        direccion: '123 Main Street, Los Angeles, California'
      },
      estado: 'En Proceso' 
    },
    {
      fecha: '15/oct/2023',
      remitente: {
        nombre: 'Pedro Martínez Ruiz',
        direccion: 'Calle Morelos #89, Tlaxiaco, Oaxaca'
      },
      destinatario: {
        nombre: 'Ana Patricia Hernández',
        direccion: '456 Oak Avenue, Chicago, Illinois'
      },
      estado: 'Pendiente' 
    }
  ];

  verEnvio(index: number) {
    // La práctica recomendada es pasar el ID del envío, no el array completo por localStorage
    localStorage.setItem('envios', JSON.stringify(this.envios)); // temporal
    this.router.navigate(['/detalle', index]);
  }

  constructor() { }

  ngOnInit() {
  }
}