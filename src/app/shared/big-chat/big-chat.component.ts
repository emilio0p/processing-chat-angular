import { Component, Input, OnInit } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';
import { Socket, io } from 'socket.io-client';

@Component({
  selector: 'app-big-chat',
  templateUrl: './big-chat.component.html',
  styleUrl: './big-chat.component.css'
})
export class BigChatComponent implements OnInit{

  constructor(private chatService: ChatService){
  }


  @Input() chat: Chat | undefined; // Selected chat data
  @Input() usuarioHost: User |undefined;

  mensajes: Message[] = [];
  nuevoMensaje: string = '';
  private socket: Socket | undefined;

  ngOnInit(): void {
    // Detecta que chat está seleccionado, a partir de ahí lógica para cada chat
    this.chatService.selectedChat$.subscribe(chat => {

      // Desconectar el socket en caso de que ya este conectado a uno al cambiar de chat
      if(this.socket){
        this.socket.disconnect();
      }

      // Se establece el chat seleccionado
      this.chat = chat;

      // Comprobación por si 'undefined'
      if(this.chat && this.usuarioHost){
        // Lógica al seleccionar un chat
        this.socket = io('http://localhost:3000' , { query: { userId: this.usuarioHost.user_id, roomId: this.chat.chat_id } });

        this.socket.emit('joinRoom', `${this.chat.chat_id}`); // Join a chat room

        this.socket.on('messageReceived', (message, userId: number) => {
          const mensaje = message.message;
          this.setMensajeChat(mensaje, userId);
        });

        this.chatService.getMessages(this.chat.chat_id).subscribe(
        messages => {
          this.mensajes = messages;
          console.log(this.mensajes);
        },
        error => {
          console.error('Error cargando los mensajes:', error);
        }
      );
    }
    });


  }

  setMensajeChat(mensaje: string, userId: number){
    if(this.chat){
      const newMessage: Message = {
        content: mensaje,
        user_id: userId, // Assuming usuarioHost has user ID
        chat_id: this.chat.chat_id,
        timestamp: new Date()
      };

      this.mensajes.push(newMessage); // Update local message list (optional)
    }


  }

  guardarMensaje() {

    if (!this.chat || !this.nuevoMensaje || !this.usuarioHost) {
      return; // Prevent sending empty messages or when no chat is selected
    }

    const newMessage: Message = {
      content: this.nuevoMensaje,
      user_id: this.usuarioHost?.user_id, // Assuming usuarioHost has user ID
      chat_id: this.chat?.chat_id,
      timestamp: new Date()
    };

    // Emit the message through Socket.IO (assuming socket is defined)
    if (this.socket) {
      this.socket.emit('sendMessage', this.nuevoMensaje); // Replace 'sendMessage' with your server-side event name
    } else {
      console.error('Socket not connected, message cannot be sent.');
    }

    this.mensajes.push(newMessage); // Update local message list (optional)

    this.chatService.saveMessageDb(newMessage.chat_id, newMessage.user_id, newMessage.content);

    this.nuevoMensaje = ''; // Clear message input

  }



}
