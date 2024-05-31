import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';

@Component({
  selector: 'app-mini-chat',
  templateUrl: './mini-chat.component.html',
  styleUrl: './mini-chat.component.css'
})
export class MiniChatComponent {
  @Input() chat: Chat | undefined; // Chat a mostrar
  @Input() tipoUsuario: string = "";
  @Output() selectChat = new EventEmitter<Chat>();

  onSelect() {
    if (this.chat) {
      this.selectChat.emit(this.chat); // Emit selected chat data
    }
  }
}
