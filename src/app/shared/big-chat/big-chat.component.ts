import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class BigChatComponent implements OnInit, OnDestroy{

  constructor(private chatService: ChatService){
  }



  @Input() chat: Chat | undefined; // Selected chat data
  @Input() usuarioHost: User |undefined;
  @Input() socket: Socket | undefined;

  mensajes: Message[] = [];
  nuevoMensaje: string = '';


  ngOnInit(): void {

    console.log(this.socket);
    // Detecta que chat está seleccionado, a partir de ahí lógica para cada chat
    this.chatService.selectedChat$.subscribe(chat => {

      if(this.chat && this.socket){
        this.socket.emit('leaveRoom', `${this.chat.chat_id}`); // Join a chat room
      }

      // Se establece el chat seleccionado
      this.chat = chat;

      // Comprobación por si 'undefined'
      if(this.chat && this.usuarioHost && this.socket){
        // Lógica al seleccionar un chat
        this.socket.emit('joinRoom', `${this.chat.chat_id}`); // Join a chat room

        // Evitar antiguos recibidos
        this.socket.off('messageReceived');
        this.socket.on('messageReceived', (message, userId: number) => {
          const mensaje = message.message.content;
          this.setMensajeChat(mensaje, userId);
        });

        this.chatService.getMessages(this.chat.chat_id).subscribe(
        messages => {
          this.mensajes = messages;
        },
        error => {
          console.error('Error cargando los mensajes:', error);
        }
      );
    }
    });


  }

  setMensajeChat(mensaje: string, userId: number){
    console.log('repetido');
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
      user_id: this.usuarioHost.user_id, // Assuming usuarioHost has user ID
      chat_id: this.chat.chat_id,
      timestamp: new Date()
    };

    // Emit the message through Socket.IO (assuming socket is defined)
    if (this.socket) {
      let recipient;

      if(this.usuarioHost.user_rol.rol_name === 'user'){
        recipient = this.chat.admin_id;
      } else {
        recipient = this.chat.client_id;
      }

      console.log(this.nuevoMensaje);
      this.socket.emit('sendMessage', {
        content: this.nuevoMensaje,
        recipientId: recipient,
        chatId: this.chat.chat_id
      });
       // Replace 'sendMessage' with your server-side event name
    } else {
      console.error('Socket not connected, message cannot be sent.');
    }

    this.mensajes.push(newMessage); // Update local message list (optional)


    this.chatService.saveMessageDb(newMessage.chat_id, newMessage.user_id, newMessage.content);

    this.nuevoMensaje = ''; // Clear message input

  }


  ngOnDestroy(): void {
    if(this.socket){
      this.socket.disconnect();
    }

  }

}
