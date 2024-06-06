import { NgModule, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MiniChatComponent } from './mini-chat/mini-chat.component';
import { BigChatComponent } from './big-chat/big-chat.component';
import { RoleNamePipe } from '../pipes/user-admin.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';
import { ChatMessageComponent } from './chat-message/chat-message.component';



@NgModule({
  declarations: [
    SidebarComponent,
    MiniChatComponent,
    BigChatComponent,
    RoleNamePipe,
    FilterPipe,
    ChatMessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    SidebarComponent,
    MiniChatComponent,
    BigChatComponent,
    ChatMessageComponent
  ]
})
export class SharedModule { }
