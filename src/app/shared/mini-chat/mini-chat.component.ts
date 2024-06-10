import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'app-mini-chat',
  templateUrl: './mini-chat.component.html',
  styleUrl: './mini-chat.component.css'
})
export class MiniChatComponent implements OnInit{

  @Input() chat: Chat | undefined; // Chat a mostrar
  @Input() tipoUsuario: string = "";
  @Output() selectChat = new EventEmitter<Chat>();
  lastMsg : Message | undefined;
  showMenu = false; // Flag to control menu visibility



  constructor(private chatService: ChatService){}

  ngOnInit(): void {
    if(this.chat){
      this.getLastMessage(this.chat.chat_id);
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu; // Invert the showMenu flag
  }
  onSelect() {
    if (this.chat) {
      this.selectChat.emit(this.chat); // Emit selected chat data
    }
  }

  public getLastMessage(chat_id: number){
    if (this.chat){
      this.chatService.getLastMessage(chat_id).subscribe(
        lstMessage => {
        this.lastMsg = lstMessage;
        this.chat!.last_message = this.lastMsg.content;
      }, error => {

      });
    }


  }

}
