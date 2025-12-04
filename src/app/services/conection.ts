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
    const crearRemitente = this.http.post(`${this.apiUrl}/envios`, pedidoData.remitente).pipe(
      map((res: any) => res.id_remitente)
    );

    return crearRemitente.pipe(
      switchMap((idRemitente: number) => {
        return this.http.post(`${this.apiUrl}/pedidos`, pedidoData.destinatario).pipe(
          map((res: any) => ({
            idRemitente: idRemitente,
            idDestinatario: res.id_destinatario,
          }))
        );
      }),
      switchMap(ids =>{
        const pedidoPayLoad = pedidoData.products.map((producto: any) => {
          const costo = Number(producto.costo);
          const cantidad = 1;

          return{
            nombre: producto.nombre,
            cantidad: cantidad,
            peso: Number(producto.peso || 0),
            precio_unitario: costo,
            subtotal: costo * cantidad,
            fragil: producto.fragil,
          };
        });

        const envioPayLoad = {
          id_remitente: ids.idRemitente,
          id_destinatario: ids.idDestinatario,

          origen:'MX',
          destino:'US',
          tipo_cobro:'MX',
          precioTotal:pedidoData.total,
          estado_envio:'RECIBIDO_NUEVO',
          firma_remitente:false,
          
          
          productos: pedidoPayLoad,
        };
        return this.http.post(`${this.apiUrl}/envios`, envioPayLoad);
      })
    );
  }
}
