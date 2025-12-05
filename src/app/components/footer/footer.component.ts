import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonFooter, IonToolbar, IonIcon, IonButtons } from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonButton, IonFooter, IonToolbar, RouterLink]
})
export class FooterComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
