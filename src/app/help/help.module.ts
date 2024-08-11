import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageAboutComponent} from './pages/page-about/page-about.component';
import {MatDialogModule} from "@angular/material/dialog";
import {SharedComponentsModule} from "../shared/components/shared-components.module";

@NgModule({
  declarations: [
    PageAboutComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    MatDialogModule
  ]
})
export class HelpModule {
}
