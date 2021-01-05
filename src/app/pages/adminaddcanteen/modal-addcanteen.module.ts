import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalAddcanteenPageRoutingModule } from './modal-addcanteen-routing.module';
import {ModalAddcanteenPage} from './modal-addcanteen.page';
import { FileSizeFormatPipe } from './file-size-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModalAddcanteenPageRoutingModule
  ],
  declarations: [ModalAddcanteenPage, FileSizeFormatPipe]
})
export class AdminaddcanteenPageModule {}


