import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  // 图片集合
  imgsrcs: any = [
    { name: '图1', src: 'assets/imgs/logo.png' },
    { name: '图2', src: 'assets/icon/favicon.ico' }
  ]

  constructor(
    public navCtrl: NavController,
    private zbar: ZBar,
    private iab: InAppBrowser,
    private callNumber: CallNumber,
    private file: File
  ) {

  }
  // 扫描
  scan() {
    let options: ZBarOptions = {
      flash: 'off',
      text_title: '扫码',
      text_instructions: '请将二维码置于红线中央',
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
  goUrl() {
    const browser = this.iab.create('http://www.baidu.com', '_self', 'location=no');
  }
  // 拨打电话功能
  callNum() {
    this.callNumber.callNumber("the number", true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }
  // 检查文件目录是否存在
  checkFile() {
    this.file
      .checkDir(this.file.dataDirectory, 'mydir')
      .then(_ => alert('文件夹存在' + this.file.dataDirectory))
      .catch(err => {
        this.createFile();
        alert('文件夹不存在' + this.file.dataDirectory)
      });
  }
  // 创建文件夹
  createFile() {
    this.file
      .createDir(this.file.dataDirectory, 'mydir', true)
      .then(_ => alert('成功创建文件夹'))
      .catch(err => alert('失败'))
  }

  //单击显示图片滑动页
  showImage(ev: any) {
    this.navCtrl.push('PhotoPage');
  }
 
}
