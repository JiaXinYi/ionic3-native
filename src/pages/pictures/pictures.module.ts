import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PicturesPage } from './pictures';

@NgModule({
  declarations: [
    PicturesPage,
  ],
  imports: [
    IonicPageModule.forChild(PicturesPage),
  ],
  exports:[PicturesPage]
})
export class PicturesPageModule {}
