import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * 思路
 * 1.放大后判定是否宽大于屏幕，高大于屏幕，先不考虑
 * 2.均大于的情况下
 * 
 * 
 * 
 */

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {

  // containerStyle
  private containerStyle: any = {};
  // imageStyle
  private imageStyle: any = {};
  //scale
  private scale: number = 1;
  // 第一次点击时间
  temp: any;
  // 第二次点击时间
  tempTime: any;
  // 单击事件倒计时
  timeout: any;
  // 是否放大
  isZoom: boolean = false;
  // 声明屏幕宽高
  private width: number = 0;
  private height: number = 0;
  // 声明图片宽高
  private imageWidth: number = 0;
  private imageHeight: number = 0;
  // 移动距离
  private position: any = {
    x: 0,
    y: 0,
  };
  // 移动距离累计
  private panCenterStart: any = {
    x: 0,
    y: 0,
  };
  @ViewChild('imageContainer') imageContainer;
  @ViewChild('image') image;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public element: ElementRef,
  ) {
  }

  doClick(event) {
    if (!this.temp) {
      this.temp = new Date();
    } else {
      this.tempTime = this.temp;
      this.temp = new Date();
    }
    //单击事件倒计时
    this.timeout = setTimeout(() => {
      // console.log('click');
    }, 400);
    //两次点击时间差
    let clickBuffer = this.temp - this.tempTime;
    //双击事件触发
    if (clickBuffer && clickBuffer < 400) {
      this.doDoubleClick(event);
      clearTimeout(this.timeout);
    }
  }
  private doDoubleClick(event) {
    console.log(this.scale);
    //放大缩小
    // this.scale = 1 ? 2 : 1;
    // this.imageStyle.transform = `scale(${this.scale})`;
    this.setCenter();
    if (!this.isZoom) {
      this.isZoom = true;
      this.scale = 2;
      this.imageStyle.transform = `scale(${this.scale}) translate(${-50 / this.scale}%,${-50 / this.scale}%)`;
    } else {
      this.isZoom = false;
      this.scale = 1;
      this.imageStyle.transform = `scale(${this.scale}) translate(-50%,-50%)`;
    }
  }
  private panEvent(event) {
    if (this.isZoom) {
      let x = (this.panCenterStart.x + event.deltaX) / this.imageWidth / this.scale;
      let y = (this.panCenterStart.x + event.deltaY) / this.imageHeight / this.scale;
      const maxX = this.imageWidth / this.imageWidth / 2 / this.scale;
      const maxY = this.imageHeight / this.imageHeight / 2 / this.scale;
      if (x > maxX) {
        x = maxX;
        this.panCenterStart.x = this.imageWidth / 2;
      }
      if (x < -maxX) {
        x = -maxX;
        this.panCenterStart.x = -this.imageWidth / 2;

      }
      if (y > maxY) {
        y = maxY;
        this.panCenterStart.x = this.imageHeight / 2;

      }
      if (y < -maxY) {
        y = -maxY;
        this.panCenterStart.x = -this.imageHeight / 2;
      }

      this.imageStyle.transform = `scale(${this.scale}) translate(${-50 / this.scale + x * 100}%,${-50 / this.scale + y * 100}%)`;
      if (event.isFinal) {
        this.panCenterStart.x += event.deltaX;
        this.panCenterStart.y += event.deltaY;
        if (this.panCenterStart.x < 0) {
          this.panCenterStart.x = Math.max(this.panCenterStart.x, -this.imageWidth / 2)

        }
        if (this.panCenterStart.x >= 0) {
          this.panCenterStart.x = Math.min(this.panCenterStart.x, this.imageWidth / 2)

        }
        if (this.panCenterStart.y < 0) {
          this.panCenterStart.y = Math.max(this.panCenterStart.y, -this.imageHeight / 2)

        }
        if (this.panCenterStart.y >= 0) {
          this.panCenterStart.y = Math.min(this.panCenterStart.y, this.imageHeight / 2)

        }
      console.log( this.panCenterStart.y );
      
      }
    }

  }
  private setCenter() {
    this.imageWidth = this.image.nativeElement.width;
    this.imageHeight = this.image.nativeElement.height;

    const realImageWidth = this.imageWidth * this.scale;
    const realImageHeight = this.imageHeight * this.scale;

    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;


    // this.centerStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
    // this.centerStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
    // this.panCenterStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
    // this.panCenterStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
    this.position.x = Math.max((this.width - realImageWidth) / (2 * this.scale), 0);
    this.position.y = Math.max((this.height - realImageHeight) / (2 * this.scale), 0);

  }

}
