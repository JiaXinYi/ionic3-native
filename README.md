### 使用步骤如下
#### 1.git clone https://github.com/JiaXinYi/Ionic-native
#### 2.cd ionic-native
#### 3.npm install
#### 4.ionic serve
#### 5.用到的插件要装，按顺序如下 

#### 1.扫描插件cszbar（三个扫描插件互相会冲突，安装新的要移除前一个，移除命令为ionic cordova plugin rm）
##### $ ionic cordova plugin add cordova-plugin-cszbar
##### $ npm install --save @ionic-native/zbar
#####  barcodescanner
##### $ ionic cordova plugin add phonegap-plugin-barcodescanner
##### $ npm install --save @ionic-native/barcode-scanner
#####  qrscanner
##### $ ionic cordova plugin add cordova-plugin-qrscanner
##### $ npm install --save @ionic-native/qr-scanner

#### 2.内部浏览器插件
##### $ ionic cordova plugin add cordova-plugin-inappbrowser
##### $ npm install --save @ionic-native/in-app-browser

#### 3.拍照插件
##### $ ionic cordova plugin add cordova-plugin-camera
##### $ npm install --save @ionic-native/camera

#### 4.打电话插件
##### $ ionic cordova plugin add call-number
##### $ npm install --save @ionic-native/call-number

#### 5.FILE插件
##### $ ionic cordova plugin add cordova-plugin-file
##### $ npm install --save @ionic-native/file