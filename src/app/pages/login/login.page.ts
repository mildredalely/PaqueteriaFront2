import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonImg, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonInput, CommonModule, RouterLink, IonImg, FormsModule, IonLabel, IonButton]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
