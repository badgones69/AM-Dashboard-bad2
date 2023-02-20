import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageAddHubComponent} from "./pages/page-add-hub/page-add-hub.component";
import {PageEditHubComponent} from "./pages/page-edit-hub/page-edit-hub.component";
import {PageListHubComponent} from "./pages/page-list-hub/page-list-hub.component";

const routes: Routes = [
  {path: '', component: PageListHubComponent},
  {path: 'new', component: PageAddHubComponent},
  {path: 'edit/:id', component: PageEditHubComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HubRoutingModule {
}
