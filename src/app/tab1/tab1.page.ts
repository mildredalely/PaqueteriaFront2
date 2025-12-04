// src/app/tab1/tab1.page.ts

import { Component } from '@angular/core';
import { IonImg, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FooterComponent } from '../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Conection } from '../services/conection';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButton, IonInput, IonLabel, IonImg, IonSelect, IonSelectOption, FooterComponent, FormsModule],
})
export class Tab1Page {

  constructor(
    private conection: Conection
  ) {}
  step = 1;

  nuevo_producto ={
    nombre: '',
    peso:'',
    costo:'',
    fragil: 'si'
  }

  pedido_data = {

    total: 0,

    remitente: {
      id_remitente: 0,
      nombre: '',
      telefono: '',
      identificacion: ''
    },

    destinatario: {
      id_destinatario: 0,
      nombre: '',
      telefono: '',
      ciudad: '',
      direccion_completa: '',
      cp: '',
      ciudad_completa: '',
      horario: '',      
    },
    
    products:[
      { nombre: 'Tortillas', peso: 20, costo: 200, fragil: true },
    ]
  }

  nextStep(){
    this.step += 1;
    if(this.step > 5){
      this.step = 1;
    }
  }

  agregarNuevoProducto(){
    const productoAgregado = {
      nombre: this.nuevo_producto.nombre,
      peso: Number(this.nuevo_producto.peso),
      costo: Number(this.nuevo_producto.costo),
      fragil: this.nuevo_producto.fragil === 'si' ? true : false
    };

    this.pedido_data.products.push(productoAgregado);
    this.pedido_data.total += productoAgregado.costo;
    this.nuevo_producto = { nombre: '', peso: '', costo: '', fragil: 'no' };
  }

  guardarPedido(){
    if(!this.pedido_data.products || this.pedido_data.products.length === 0){
      alert('Agrega al menos un producto');
      return; 
    }

    this.conection.createPedido(this.pedido_data).subscribe({
      next: (response) =>{
        console.log('Envío registrado con éxito', response);
        this.step = 5;
      },
      error: (error) =>{
        console.error('Error al procesar el envío ', error);
        alert('Error al procesar el envío');
      }
    });
  }
}
