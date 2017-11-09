import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private zbar: ZBar
  ) {

  }
  scan() {
    let options: ZBarOptions = {
      flash: 'off',
      text_title: '扫码',
      drawSight: false
    };

    this.zbar.scan(options)
      .then(result => {
        alert("结果：" + result); // Scanned code
      })
      .catch(error => {
        alert(error); // Error message
      });
  }
}
