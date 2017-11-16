import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private zbar: ZBar,
    private iab: InAppBrowser,
    private callNumber: CallNumber
  ) {

  }
  // 扫描
  scan() {
    let options: ZBarOptions = {
      flash: 'off',
      text_title: '扫码',
      text_instructions:'请将二维码置于红线中央',
      // camera: "front" || "back",
      drawSight: true
    };

    this.zbar.scan(options)
      .then(result => {
        alert("结果：" + result); // Scanned code
        const browser = this.iab.create(result);
      })
      .catch(error => {
        alert(error); // Error message
      });
  }
  // 跳转到网页
  goUrl(){
    const browser = this.iab.create('http://www.baidu.com','_self','location=no');
  }
  // 拨打电话功能
  callNum(){
    this.callNumber.callNumber("the number", true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }
}
