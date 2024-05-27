import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { ClientMainComponent } from './client-main/client-main.component';


@NgModule({
  declarations: [
    HomePageComponent,
    AdminMainComponent,
    ClientMainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
