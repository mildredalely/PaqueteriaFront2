import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
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
  // Campos adicionales del backend
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
    private conectionService: Conection
  ) { }

  ngOnInit() {
    this.cargarEnvios();
  }

  /**
   * Cargar todos los envíos desde el backend
   */
  cargarEnvios() {
    this.isLoading = true;
    this.error = null;

    this.conectionService.getEnvios().subscribe({
      next: (response) => {
        console.log('Envíos recibidos:', response);
        
        // Mapear los datos del backend al formato que necesita el frontend
        this.envios = response.map((envio: any) => this.mapearEnvio(envio));
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar envíos:', error);
        this.error = 'No se pudieron cargar los envíos. Por favor, intenta de nuevo.';
        this.isLoading = false;
        
        // Opcional: Mantener datos de ejemplo en caso de error durante desarrollo
        // this.cargarDatosEjemplo();
      }
    });
  }

  /**
   * Mapear los datos del backend al formato del frontend
   * @param envioBackend - Objeto envío desde el backend
   */
  mapearEnvio(envioBackend: any): Envio {
    // Extraer información del remitente
    const remitenteInfo = envioBackend.remitente ? 
      `${envioBackend.remitente.nombre || ''} ${envioBackend.remitente.apellido || ''}
${envioBackend.remitente.direccion || ''}` : 'Sin información';

    // Extraer información del destinatario
    const destinatarioInfo = envioBackend.destinatario ? 
      `${envioBackend.destinatario.nombre || ''} ${envioBackend.destinatario.apellido || ''}
${envioBackend.destinatario.direccion || ''}` : 'Sin información';

    // Formatear la fecha
    const fecha = this.formatearFecha(envioBackend.fecha_creacion || envioBackend.created_at);

    // Mapear el estado del backend al estado del frontend
    const estado = this.mapearEstado(envioBackend.estado_envio);

    return {
      id_envio: envioBackend.id_envio,
      numero: `Envío #${envioBackend.id_envio || 'N/A'}`,
      fecha: fecha,
      remitente: remitenteInfo,
      destinatario: destinatarioInfo,
      estado: estado,
      origen: envioBackend.origen,
      destino: envioBackend.destino,
      precio_total: envioBackend.precio_total,
      estado_envio: envioBackend.estado_envio
    };
  }

  /**
   * Mapear los estados del backend a los estados del frontend
   * @param estadoBackend - Estado desde el backend
   */
  mapearEstado(estadoBackend: string): 'recibido' | 'enviado' | 'en-transito' | 'completado' {
    const mapaEstados: { [key: string]: 'recibido' | 'enviado' | 'en-transito' | 'completado' } = {
      'RECIBIDO_NUEVO': 'recibido',
      'RECIBIDO': 'recibido',
      'ENVIADO': 'enviado',
      'EN_TRANSITO': 'en-transito',
      'EN TRANSITO': 'en-transito',
      'COMPLETADO': 'completado',
      'ENTREGADO': 'completado'
    };

    return mapaEstados[estadoBackend?.toUpperCase()] || 'recibido';
  }

  /**
   * Formatear fecha al formato dd/mmm/yyyy
   * @param fecha - Fecha en formato ISO o string
   */
  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';

    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();

    return `${dia}/${mes}/${año}`;
  }

  /**
   * Cargar datos de ejemplo (útil para desarrollo/testing)
   * Puedes eliminar este método cuando ya no lo necesites
   */
  cargarDatosEjemplo() {
    this.envios = [
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
  }

  // ========== MÉTODOS DEL CARRUSEL ==========

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

  // ========== MÉTODOS DE VISUALIZACIÓN ==========

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

  /**
   * Método para refrescar los datos (útil con ion-refresher)
   */
  refrescarEnvios(event?: any) {
    this.cargarEnvios();
    
    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }
}