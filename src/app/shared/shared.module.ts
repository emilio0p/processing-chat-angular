import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MiniChatComponent } from './mini-chat/mini-chat.component';
import { BigChatComponent } from './big-chat/big-chat.component';
import { RoleNamePipe } from '../pipes/user-admin.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';



@NgModule({
  declarations: [
    SidebarComponent,
    MiniChatComponent,
    BigChatComponent,
    RoleNamePipe,
    FilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule

  ],
  exports:[
    SidebarComponent,
    MiniChatComponent,
    BigChatComponent
  ]
})
export class SharedModule { }
