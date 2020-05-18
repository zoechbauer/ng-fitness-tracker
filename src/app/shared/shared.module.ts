import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../material.module';

const sharedModules = [
  CommonModule,
  FormsModule,
  MaterialModule,
  FlexLayoutModule,
];

@NgModule({
  imports: [sharedModules],
  exports: [sharedModules],
})
export class SharedModule {}
