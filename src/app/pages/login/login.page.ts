import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonImg, IonLabel, IonButton, IonInput } from '@ionic/angular/standalone';
import { Conection } from 'src/app/services/conection';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonInput, CommonModule, RouterLink, IonImg, FormsModule, IonLabel, IonButton]
})
export class LoginPage implements OnInit {
  credentials = {
    username: '',
    password: ''
  };

  constructor(
    private conection: Conection,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
  }
  async login() {
    this.conection.login(this.credentials).subscribe({
      next: (res) => {
        this.mostrarToast(`Bienvenido ${this.credentials.username}`);
        this.router.navigateByUrl('/envio-mx', { replaceUrl: true });
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
      }
    });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000, 
      position: 'bottom',
      animated: true,
      color: 'success'
    });
    toast.present();
  }
}
