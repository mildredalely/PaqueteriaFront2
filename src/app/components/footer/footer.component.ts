import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonFooter, IonToolbar, IonIcon, IonButtons } from "@ionic/angular/standalone";
import { Observable } from 'rxjs';
import { Conection } from 'src/app/services/conection';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonButton, IonFooter, IonToolbar, RouterLink]
})
export class FooterComponent  implements OnInit {

  constructor(
    private conection: Conection,
    private router: Router,
  ) { }

  ngOnInit() {}

  logout(): Observable<any> {
    // Limpiar datos locales
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Retornar un Observable vacío o hacer una llamada simbólica
    this.router.navigate(['/login'], { });
    return new Observable(observer => {
      observer.next({ success: true });
      observer.complete();
    });
  }
}
