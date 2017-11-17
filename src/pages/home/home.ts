import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // 第一次点击时间
  temp: any;
  // 第二次点击时间
  tempTime: any;
  // 单击事件倒计时
  timeout: any;
  // 是否放大
  isZoom: boolean = false;
  // 是否查看大图
  isWatchDetail: boolean = false;
  // 是否在移动图片
  isPan: boolean = false;
  // 初始值
  initalX: number = 0;
  initalY: number = 0;
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
    let imgScale = ev.target;
    imgScale.style.transition = 'transform 0.33s';
    this.isWatchDetail = !this.isWatchDetail;
  }
  //单击关闭图片滑动页，需要判断是不是双击
  doClick(ev: any) {
    // // 
    clearTimeout(this.timeout);
    if (!this.temp) {
      this.temp = new Date();
    } else {
      this.tempTime = this.temp;
      this.temp = new Date();
    }
    //单击事件倒计时
    this.timeout = setTimeout(() => {
      this.slideDown(ev);
    }, 400);
    //两次点击时间差
    let clickBuffer = this.temp - this.tempTime;
    //双击事件触发
    if (clickBuffer && clickBuffer < 400) {
      this.doDoubleClick(ev);
      clearTimeout(this.timeout);
    }


  }
  //双击放大缩小
  doDoubleClick(ev: any) {
    //获取事件对象
    console.log("double");
    let imgScale = ev.target;
    imgScale.style.transition = 'transform 0.33s';

    if (!this.isZoom) {
      imgScale.style.transform = 'scale(2)';
    } else {
      imgScale.style.transform = 'scale(1)';
    }
    this.isZoom = !this.isZoom;
  }
  // 回退
  slideDown(ev: any) {
    let imgScale = ev.target;
    if (this.isZoom) {
      imgScale.style.transition = 'transform 0.33s';
      imgScale.style.transform = 'scale(1)';
    } else {
      setTimeout(() => {
        this.isWatchDetail = !this.isWatchDetail;
      }, 400);
    }
    this.isZoom = !this.isZoom;
    this.isPan = !this.isPan;

  }
  // 移动图片
  panMove(ev: any) {
    if (this.isZoom) {
      this.isPan = !this.isPan;
      console.log("pan");
      let imgWrap = ev.target.parentElement.parentElement;

      let evX = ev.deltaX;
      let evY = ev.deltaY;
      if (this.isWatchDetail && this.isPan) {
        imgWrap.style.transform = 'translate(' + (evX + this.initalX) + 'px,' + (evY + this.initalY) + 'px)';
        imgWrap.style.transition = 'transform 0s';
      }
    }
  }
}
