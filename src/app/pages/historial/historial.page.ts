import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FooterComponent } from "src/app/components/footer/footer.component";
import { Conection } from 'src/app/services/conection';

interface Envio {
  id_envio?: number;
  numero: string;
  fecha: string;
  remitente: string;
  destinatario: string;
  estado: 'recibido' | 'enviado' | 'en-transito' | 'completado';
  origen?: string;
  destino?: string;
  precio_total?: number;
  estado_envio?: string;
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
  envios: Envio[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private conectionService: Conection,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarEnvios();
  }

  cargarEnvios() {
    this.isLoading = true;
    this.error = null;

    this.conectionService.getEnvios().subscribe({
      next: (response) => {
        console.log('Envíos recibidos:', response);
        this.envios = response.map((envio: any) => this.mapearEnvio(envio));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar envíos:', error);
        this.error = 'No se pudieron cargar los envíos. Por favor, intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  mapearEnvio(envioBackend: any): Envio {
    const remitenteInfo = envioBackend.remitente ? 
      `${envioBackend.remitente.nombre || ''} ${envioBackend.remitente.apellido || ''}
${envioBackend.remitente.direccion || ''}` : 'Sin información';

    const destinatarioInfo = envioBackend.destinatario ? 
      `${envioBackend.destinatario.nombre || ''} ${envioBackend.destinatario.apellido || ''}
${envioBackend.destinatario.direccion || ''}` : 'Sin información';

    const fechaBackend = envioBackend.created_at || envioBackend.fecha_creacion || new Date().toISOString();
    const fecha = this.formatearFecha(fechaBackend);
    const estado = this.mapearEstado(envioBackend.estado_envio);

    return {
      id_envio: envioBackend.id_envio,
      numero: `Envío #${envioBackend.id_envio || 'N/A'}`,
      fecha,
      remitente: remitenteInfo,
      destinatario: destinatarioInfo,
      estado,
      origen: envioBackend.origen,
      destino: envioBackend.destino,
      precio_total: envioBackend.precio_total,
      estado_envio: envioBackend.estado_envio
    };
  }

  mapearEstado(estadoBackend: string): 'recibido' | 'enviado' | 'en-transito' | 'completado' {
    if (!estadoBackend) return 'recibido';

    const mapaEstados: { [key: string]: 'recibido' | 'enviado' | 'en-transito' | 'completado' } = {
      'RECIBIDO_NUEVO': 'recibido',
      'RECIBIDO': 'recibido',
      'ENVIADO': 'enviado',
      'EN_TRANSITO': 'en-transito',
      'EN TRANSITO': 'en-transito',
      'COMPLETADO': 'completado',
      'ENTREGADO': 'completado'
    };

    return mapaEstados[estadoBackend.toUpperCase()] || 'recibido';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';

    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'Sin fecha';

    const dia = date.getDate().toString().padStart(2, '0');
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();

    return `${dia}/${mes}/${año}`;
  }

  async cambiarEstadoEnvio(envio: Envio) {
    console.log('Botón clickeado - Envío:', envio);
    
    if (!envio.id_envio) {
      await this.mostrarMensaje('Error: ID de envío no disponible', 'danger');
      return;
    }

    try {
      const alert = await this.alertController.create({
        header: 'Cambiar Estado',
        subHeader: `Envío #${envio.id_envio}`,
        message: `Estado actual: ${this.getEstadoTexto(envio.estado)}`,
        cssClass: 'custom-alert',
        mode: 'ios',
        inputs: [
          {
            type: 'radio',
            label: 'Recibido',
            value: 'RECIBIDO',
            checked: envio.estado === 'recibido'
          },
          {
            type: 'radio',
            label: 'Enviado',
            value: 'ENVIADO',
            checked: envio.estado === 'enviado'
          },
          {
            type: 'radio',
            label: 'En Tránsito',
            value: 'EN_TRANSITO',
            checked: envio.estado === 'en-transito'
          },
          {
            type: 'radio',
            label: 'Completado',
            value: 'COMPLETADO',
            checked: envio.estado === 'completado'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => {
              console.log('Usuario canceló');
            }
          },
          {
            text: 'Actualizar',
            cssClass: 'alert-button-confirm',
            handler: (nuevoEstado) => {
              console.log('Nuevo estado seleccionado:', nuevoEstado);
              if (nuevoEstado && envio.id_envio) {
                this.actualizarEstado(envio.id_envio, nuevoEstado);
                return true;
              } else {
                this.mostrarMensaje('Por favor selecciona un estado', 'warning');
                return false;
              }
            }
          }
        ]
      });

      await alert.present();
      console.log('Alert presentado');
    } catch (error) {
      console.error('Error al mostrar alert:', error);
      await this.mostrarMensaje('Error al mostrar opciones', 'danger');
    }
  }

  actualizarEstado(idEnvio: number, nuevoEstado: string) {
    this.conectionService.actualizarEstadoEnvio(idEnvio, nuevoEstado).subscribe({
      next: (response) => {
        console.log('Estado actualizado:', response);
        this.mostrarMensaje('Estado actualizado correctamente', 'success');
        this.cargarEnvios();
      },
      error: (error) => {
        console.error('Error al actualizar estado:', error);
        this.mostrarMensaje('Error al actualizar el estado', 'danger');
      }
    });
  }

  async mostrarMensaje(mensaje: string, color: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK'],
      cssClass: color
    });
    await alert.present();
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
    return estados[estado] || 'Recibido';
  }

  verDetalle(envio: Envio) {
    this.router.navigate(['/detalle-historial'], { 
      state: { envio: envio } 
    });
  }

  refrescarEnvios(event?: any) {
    this.cargarEnvios();
    
    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }
}