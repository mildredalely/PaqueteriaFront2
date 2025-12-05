import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, FormsModule, ],
})
export class AppComponent {
  ngOntInit() {
    this.setFullScreenMode();
  }

  constructor() {}

  async setFullScreenMode(){
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.hide();
  }
}
