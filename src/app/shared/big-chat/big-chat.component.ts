import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Chat, ChatEditStatusDTO } from '../../interfaces/chat.interface';
import { User } from '../../interfaces/user.interface';
import { Message } from '../../interfaces/message.interface';
import { ChatService } from '../../services/chat.service';
import { Socket, io } from 'socket.io-client';
import swal2 from 'sweetalert2'
import { Router } from '@angular/router';


@Component({
  selector: 'app-big-chat',
  templateUrl: './big-chat.component.html',
  styleUrl: './big-chat.component.css'
})
export class BigChatComponent implements OnInit, OnDestroy{

  constructor(private chatService: ChatService, private router: Router){
  }



  @Input() chat: Chat | undefined; // Selected chat data
  @Input() usuarioHost: User |undefined;
  @Input() socket: Socket | undefined;

  mensajes: Message[] = [];
  nuevoMensaje: string = '';
  showForm: boolean = true;
  formURL: string = '';


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
        this.generateFormURL();
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

  generateFormURL() {

    switch (this.chat!.form_id) {
      case 1:
        this.formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdMD26-mHiM2C_Jas65GkjQuLOmZbhyxzPU-wH4z-ePZC6HUg/viewform?usp=sf_link'; // Libro de testigos sin guardas
        break;
      case 2:
        this.formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfM-9pSuojlO0RyyOQqRhDtlkwkHAmCArpNazz15j4qptJm1g/viewform?usp=sf_link'; // Libro de testigos con guardas
        break;
      case 3:
        this.formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdfu_biXUvYY8mTvWLW2146NnpcqSVJ7-SscSFqPEaRp7IrVA/viewform?usp=sf_link'; // Libro de firmas con guardas
        break;
      case 4:
        this.formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSe9kkdZ5Y-mR9hZKyP3_3Dp5eQrShJWyG9bA1veXV_vLJ8T9g/viewform?usp=sf_link'; // Libro de firmas sin guardas
        break;
      case 5:
        this.formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSexPX4rRjZ7hfD5S88OuMAwxF0-yfRl87-k2x_3z3jQm8u90w/viewform?usp=sf_link'; // Carpeta de testigos con guardas
        break;
      case 6:
        this.formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfkAQpAZKeuwcG20SOyi4L-C8cL7z9xXiEYNazHXl3bFLraLA/viewform?usp=sf_link'; // Carpeta de testigos sin guardas
        break;
      case 7:
        this.formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfQhxBphenTphxccpR-Ld1FcswPLDaeiaI4N7SKlClrZOtulg/viewform?usp=sf_link'; // Libro de testigos completo
        break;
      default:
        this.formURL = 'https://www.google.com/'; // Default URL if no match found
    }
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

  toogleForm() {
    window.open(this.formURL, '_blank');
    setTimeout(() =>{
      swal2.fire({
        showDenyButton: true,
        title: '¿Has enviado el formulario?',
        text: 'Por favor, confirmanos si has enviado o no el formulario al que has sido redirigido.',
        icon: 'question',
        animation: true,
        allowOutsideClick: false,
        confirmButtonText: 'Sí',
        denyButtonText: 'No'
      }).then((result) => {
        if(result.isConfirmed){
          this.showForm = false;
          const editStatus: ChatEditStatusDTO = {
            status_id: 2
          }
          this.chatService.changeStatus(this.chat!.chat_id, editStatus);
          setTimeout(() => {
            window.location.reload();
          }, 2000)


        }
      });
    }, 5000);





  }


  ngOnDestroy(): void {
    if(this.socket){
      this.socket.disconnect();
    }

  }



}
