import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HubRoutingModule} from './hub-routing.module';
import {HubFormComponent} from './form-component/hub-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {PageAddHubComponent} from "./pages/page-add-hub/page-add-hub.component";
import {PageListHubComponent} from "./pages/page-list-hub/page-list-hub.component";
import {PageEditHubComponent} from "./pages/page-edit-hub/page-edit-hub.component";
import {PageDeleteHubComponent} from "./pages/page-delete-hub/page-delete-hub.component";
import {SharedComponentsModule} from "../shared/components/shared-components.module";

@NgModule({
  declarations: [
    PageListHubComponent,
    HubFormComponent,
    PageAddHubComponent,
    PageEditHubComponent,
    PageDeleteHubComponent
  ],
  imports: [
    CommonModule,
    HubRoutingModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule
  ]
})
export class HubModule {
}
