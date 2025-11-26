import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonImg, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { Router} from '@angular/router';
import { Conection } from 'src/app/services/conection';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonLabel, IonImg,  CommonModule, FormsModule,]
})
export class RegistrarPage implements OnInit {

  credentials = {
    username: '',
    password: ''
  }

  constructor(
    private conection: Conection,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  async register(){
    this.conection.register(this.credentials).subscribe({

      next: (res) => {
        this.mostrarToast(`Usuario ${this.credentials.username} registrado con éxito`);
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error(err){
        console.error('Error al registrar el usuario: ',err);
      }
    });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000, 
      position: 'bottom',
      animated: true,
      color: 'success',
      swipeGesture: "vertical",
      icon: 'checkmark-circle-outline'
    });
    toast.present();
  }
}
