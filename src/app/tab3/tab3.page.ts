import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCardTitle, IonCardHeader, IonCard } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ReporteComponent } from '../reporte/reporte.component';
import { FooterComponent } from '../components/footer/footer.component';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [ReporteComponent, FooterComponent],
})
export class Tab3Page {
  constructor() {}
}
