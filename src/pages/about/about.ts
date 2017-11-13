import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public images: Array<{ src: string }>;

  constructor(
    public navCtrl: NavController,
    public camera: Camera
  ) {
    this.images = [];

  }

  getPictureByCamera() {
    const options: CameraOptions = {
      quality: 100,//图片质量
      destinationType: this.camera.DestinationType.FILE_URI,//返回值的格式
      sourceType: this.camera.PictureSourceType.CAMERA,//设置图片的来源
      allowEdit:true,//是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,//选择返回的图像文件的编码

      mediaType: this.camera.MediaType.PICTURE,//选择媒体类型，根据sourceType确定
      saveToPhotoAlbum: true//是否在拍照后保存到相册
    }

    this.camera.getPicture(options).then((imageURI) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.images.unshift({
      //   src:base64Image
      // })
      this.images.unshift({
        src: imageURI
      })
    }, (err) => {
      // Handle error
    });
  }
  gerPictureByLibrary(){
    const options: CameraOptions = {
      quality: 100,//图片质量
      destinationType: this.camera.DestinationType.FILE_URI,//相机输出值的格式，DATA_URL：返回base64编码的字符串,太大，易崩溃，FILE_URI：安卓文件URI，NATIVE_URI：ios
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,//设置图片的来源
      // allowEdit:true,//是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,//选择返回的图像文件的编码
      mediaType: this.camera.MediaType.ALLMEDIA,//选择媒体类型，根据sourceType确定
    }
    this.camera.getPicture(options).then((imageURI) => {
      this.images.unshift({
        src: imageURI
      })

    }, (err) => {
      // Handle error
    });
  }
}
