import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MiniChatComponent } from './mini-chat/mini-chat.component';
import { BigChatComponent } from './big-chat/big-chat.component';



@NgModule({
  declarations: [
    SidebarComponent,
    MiniChatComponent,
    BigChatComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    SidebarComponent,
    MiniChatComponent,
    BigChatComponent
  ]
})
export class SharedModule { }
