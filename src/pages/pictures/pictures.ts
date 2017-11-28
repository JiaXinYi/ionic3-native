import { Component, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subject } from 'rxjs/Subject';

/**
 * Generated class for the PicturesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pictures',
  templateUrl: 'pictures.html',
})
export class PicturesPage implements OnInit {

  // 内容区样式
  private modalStyle: any = {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  };
  // 屏幕宽高
  private width: number = 0;
  private height: number = 0;

  // Subject 之所以具有 Observable 中的所有方法，是因为 Subject 类继承了 Observable 类，在 Subject 类中有五个重要的方法：
  // next - 每当 Subject 对象接收到新值的时候，next 方法会被调用
  // error - 运行中出现异常，error 方法会被调用
  // complete - Subject 订阅的 Observable 对象结束后，complete 方法会被调用
  // subscribe - 添加观察者
  // unsubscribe - 取消订阅 (设置终止标识符、清空观察者列表)

  // Subject对象
  private resizeTriggerer: Subject<any> = new Subject();
  // slider加载状态
  private sliderLoaded: boolean = false;
  // slides初始化
  private initialSlide: number = 0;
  // 图片集合
  photos: any = [
    { name: '图1', src: 'assets/imgs/logo.png' },
    { name: '图2', src: 'assets/icon/favicon.ico' }
  ]
  // slidesStyle默认隐藏
  private slidesStyle: any = {
    visibility: 'hidden',
  };
  // containerStyle
  private containerStyle: any = {};
  // imageStyle
  private imageStyle: any = {};

  private loading: boolean = true;
  // 缩放比例
  private scale: number = 1;
  // 最大最小缩放比例
  private maxScale: number = 3;
  private minScale: number = 1;
  private minScaleBounce: number = 0.2;
  private maxScaleBounce: number = 0.35;
  // 获取slider
  @ViewChild('slider') slider: Slides;
  // slides被激活的序数
  // private currentSlide: number = 0;

  // 声明图片宽高
  private imageWidth: number = 0;
  private imageHeight: number = 0;

  private resizeSubscription: any;
  // 图片初始大小
  private originalSize: any = {
    width: 0,
    height: 0,
  };
  private position: any = {
    x: 0,
    y: 0,
  };
  private centerStart: any = {
    x: 0,
    y: 0,
  };
  private panCenterStart = {
    x: 0, y: 0,
  };
  zoomChange = new EventEmitter();

  // 构造函数
  constructor(
    private viewCtrl: ViewController,
    private element: ElementRef,

  ) {
    // 初始化显示第2张图
    this.initialSlide = 1;
  }
  public ngOnInit() {
    this.resize({});
  }
  private ionViewDidEnter() {
    this.resize(false);
    // 加载后隐藏div，显示slides
    this.sliderLoaded = true;
    this.slidesStyle.visibility = 'visible';
  }
  private resize(event) {
    if (this.slider)
      this.slider.update();
    this.width = this.element.nativeElement.offsetWidth;
    this.height = this.element.nativeElement.offsetHeight;
    console.log(this.width, this.height);
    // 每当 Subject 对象接收到新值的时候，next 方法会被调用
    this.resizeTriggerer.next({
      width: this.width,
      height: this.height,
    });
  }
  // 图片的宽高变换
  public resizeImage(event) {
    // Get the image dimensions
    this.saveImageDimensions();
  }
  handleImageResized(dimensions) {
    this.imageWidth = dimensions.width;
    this.imageHeight = dimensions.height;

    this.originalSize.width = dimensions.originalWidth;
    this.originalSize.height = dimensions.originalHeight;

    this.saveImageDimensions();
  }
  private saveImageDimensions() {
    const width = this.originalSize.width;
    const height = this.originalSize.height;

    this.maxScale = Math.max(width / this.imageWidth - this.maxScaleBounce, 1);

    this.displayScale();
  }

  // 按钮关闭页面
  public dismiss() {
    this.viewCtrl.dismiss();
  }

  // 双击事件
  private doubleTapEvent(event) {
    // 设置中心
    this.setCenter(event);
    // 当前缩放比例大于1则缩小至1，小于等于则放大到2.5
    let scale = this.scale > 1 ? 1 : 2.5;
    // 但不超过设置的最大比例值
    if (scale > this.maxScale) {
      scale = this.maxScale;
    }

    this.zoomChange.emit({
      scale: scale,
    });

    this.animateScale(scale);
  }
  // 移动事件
  private panEvent(event) {
    // calculate center x,y since pan started
    const x = Math.max(Math.floor(this.panCenterStart.x + event.deltaX), 0);
    const y = Math.max(Math.floor(this.panCenterStart.y + event.deltaY), 0);

    this.centerStart.x = x;
    this.centerStart.y = y;

    if (event.isFinal) {
      this.panCenterStart.x = x;
      this.panCenterStart.y = y;
    }

    this.displayScale();
  }

  private imageLoad(event) {
    // // Save the original dimensions
    // this.originalDimensions.width = event.target.width;
    // this.originalDimensions.height = event.target.height;

    // this.saveImageDimensions();

    // // Mark as not loading anymore
    this.loading = false;
  }
  // 设置在图像上计算的启动中心(以及比率)
  private setCenter(event) {
    const realImageWidth = this.imageWidth * this.scale;
    const realImageHeight = this.imageHeight * this.scale;

    this.centerStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
    this.centerStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
    this.panCenterStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
    this.panCenterStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);

  }
  // 动画
  private animateScale(scale: number) {
    this.scale += (scale - this.scale) / 5;

    if (Math.abs(this.scale - scale) <= 0.1) {
      this.scale = scale;
    }

    this.displayScale();

    if (Math.abs(this.scale - scale) > 0.1) {
      window.requestAnimationFrame(this.animateScale.bind(this, scale));
    } else {
      // this.checkScroll();
    }
  }

  // 计算位置，并将适当的比例设置给元素和容器
  private displayScale() {
    const realImageWidth = this.imageWidth * this.scale;
    const realImageHeight = this.imageHeight * this.scale;

    this.position.x = Math.max((this.width - realImageWidth) / (2 * this.scale), 0);
    this.position.y = Math.max((this.height - realImageHeight) / (2 * this.scale), 0);

    this.imageStyle.transform = `scale(${this.scale}) translate(${this.position.x}px, ${this.position.y}px)`;
    this.containerStyle.width = `${realImageWidth}px`;
    this.containerStyle.height = `${realImageHeight}px`;
  }
}
