import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Ubicacion } from './ubicacion';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class Conection {
  private apiUrl = environment.apiUrl;
  public paisActual: string | null = null;

  constructor(
    private http: HttpClient,
    private ubicacion: Ubicacion
  ) {
    
  }
  
  async getUbicacion(){
    try{
      const ubicacion = await Geolocation.getCurrentPosition();
      const lat = ubicacion.coords.latitude;
      const lon = ubicacion.coords.longitude;

      const pais = await this.ubicacion.obtenerUbicacionNombre(lat, lon);
      this.paisActual = pais;

      alert(`Ubicación obtenida: ${pais}`);
    }catch(error){
      console.error('Error al obtener la ubicación', error);
      alert('Error al obtener la ubicación');
    }
  }

  register(credentials: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/register`, credentials);
  }

  login(credentials: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  createPedido(pedidoData: any): Observable<any>{
    const remitentePayLoad = {
      nombre: pedidoData.remitente.nombre,
      telefono: pedidoData.remitente.telefono,
      direccion: pedidoData.remitente.direccion,
      email: pedidoData.remitente.email,
      apellido: pedidoData.remitente.apellido,
    }
    const crearRemitente = this.http.post(`${this.apiUrl}/remitentes`, remitentePayLoad).pipe(
      map((res: any) => res.id_remitente)
    );

    return crearRemitente.pipe(
      switchMap((idRemitente: number) => {
        const destinatarioPayLoad = {
          nombre: pedidoData.destinatario.nombre,
          apellido: pedidoData.destinatario.apellido,
          telefono: pedidoData.destinatario.telefono,
          email: pedidoData.destinatario.email,
          direccion: pedidoData.destinatario.direccion_completa,
        }
        return this.http.post(`${this.apiUrl}/destinatario`, destinatarioPayLoad).pipe(
          map((res: any) => ({
            idRemitente: idRemitente,
            idDestinatario: res.id_destinatario,
          }))
        );
      }),
      switchMap(ids =>{
        const pedidoPayLoad = pedidoData.products.map((producto: any) => {
          const costo = Number(producto.costo || 0);
          const cantidad = 1;

          return{
            descripcion: producto.nombre,
            tipo_producto: 'OTRO',
            cantidad: cantidad,
            peso_libras: Number(producto.peso || 0),
            precio_unitario: costo,
            valor_declarado: costo,
            subtotal: Number(producto.costo * cantidad),
          };
        });

        if(this.paisActual === 'México'){
            
          const envioPayLoad = {
            id_remitente: ids.idRemitente,
            id_destinatario: ids.idDestinatario,
            origen:'MX',
            destino:'US',
            tipo_cobro:'MX',
            precio_total:Number(pedidoData.total || 0),
            estado_envio:'RECIBIDO_NUEVO',
            firma_remitente: false,
            
            
            mercancias: pedidoPayLoad,
          };
          return this.http.post(`${this.apiUrl}/envios`, envioPayLoad);
        }else{
          const envioPayLoad = {
            id_remitente: ids.idRemitente,
            id_destinatario: ids.idDestinatario,
            origen:'US',
            destino:'MX',
            tipo_cobro:'MX',
            precio_total:Number(pedidoData.total || 0),
            estado_envio:'RECIBIDO_NUEVO',
            firma_remitente: false,
            
            
            mercancias: pedidoPayLoad,
          };
          return this.http.post(`${this.apiUrl}/envios`, envioPayLoad);
        }
      })
    );
  }
  // Obtener todos los envíos
getEnvios(): Observable<any> {
  return this.http.get(`${this.apiUrl}/envios`);
}

// Obtener envíos por remitente (si necesitas filtrar)
getEnviosByRemitente(idRemitente: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/envios/remitente/${idRemitente}`);
}

// Obtener un envío específico por ID
getEnvioById(idEnvio: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/envios/${idEnvio}`);
}
}