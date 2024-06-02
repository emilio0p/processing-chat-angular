import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-big-chat',
  templateUrl: './big-chat.component.html',
  styleUrl: './big-chat.component.css'
})
export class BigChatComponent implements OnInit{

  constructor(private chatService: ChatService){}

  @Input() chat: Chat | undefined; // Selected chat data
  @Input() usuarioHost: User |undefined;

  mensajes: Message[] = [];
  nuevoMensaje: string = '';

  ngOnInit(): void {
    if(this.chat){
      this.chatService.getMessages(this.chat.chat_id).subscribe(
        messages => {
          this.mensajes = messages;

        },
        error => {
          console.error('Error fetching messages:', error);
        }
      )
    }
  }

  guardarMensaje(){
    if (!this.chat || !this.nuevoMensaje || !this.usuarioHost) {
      return; // Prevent sending empty messages or when no chat is selected
    }
    const newMessage: Message = {
      // Set message properties (content, senderId, chatId, etc.) based on your Message interface
      content: this.nuevoMensaje,
      user_id: this.usuarioHost?.user_id, // Assuming usuarioHost has user ID
      chat_id: this.chat?.chat_id
    };

    this.mensajes.push(newMessage); // Update local message list (optional)
        this.nuevoMensaje = ''; // Clear message input
    console.log(newMessage)
  }

}
