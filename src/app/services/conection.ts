import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class Conection {
  private apiUrl = environment.apiUrl;
  

  constructor(private http: HttpClient) {}
  

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
      })
    );
  }
}
