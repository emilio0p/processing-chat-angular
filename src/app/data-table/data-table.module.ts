import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DataTableRoutingModule } from './data-table-routing.module';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersPageComponent
  ],
  imports: [
    CommonModule,
    DataTableRoutingModule,
    FormsModule,

  ]
})
export class DataTableModule { }
