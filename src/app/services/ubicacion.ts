import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Ubicacion {
  constructor(private http: HttpClient) {}

  async obtenerUbicacionNombre(lat: Number, lon: Number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
    const headers = new HttpHeaders({
      'User-Agent': 'PaqueteriaFrontApp/1.0'
    });

    try {
      const response: any = await firstValueFrom(this.http.get(url, { headers }));

      if (response && response.address) {
        const pais = response.address.country || '';
        return pais || 'País no identificado';
      }
      return 'Error al obtener la ubicación';
    }catch (error) {
      console.error('Error al obtener la ubicación', error);
      return 'Error al obtener la ubicación';
    }
  }

}
