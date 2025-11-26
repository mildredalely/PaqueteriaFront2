import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
