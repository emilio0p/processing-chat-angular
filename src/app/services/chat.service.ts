import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private http: HttpClient) {

    }

    // Chats

    getChats() {
        return this.http.get<Chat[]>("http://127.0.0.1:8000/api/v1/chats");
    }

    getClientChat(clientId: number){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Chat[]>("http://127.0.0.1:8000/api/v1/chats/client=" + clientId, {headers});
    }

    // Mensajes

    getMessages(chatId: number){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Message[]>("http://127.0.0.1:8000/api/v1/messages/chat=" + chatId, {headers});
    }

}
