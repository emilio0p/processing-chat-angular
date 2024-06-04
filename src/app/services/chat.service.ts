import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
// TODO CAMBIAR URL CON EL ENV
    constructor(private http: HttpClient) {

    }

    apiUrl = environment.apiUrl;

    private selectedChatSource = new BehaviorSubject<Chat | undefined>(undefined);
    selectedChat$ = this.selectedChatSource.asObservable();

    setSelectedChat(chat: Chat) {
      this.selectedChatSource.next(chat);
    }

    // Chats

    getChats() {
        return this.http.get<Chat[]>(`${this.apiUrl}/api/v1/chats`);
    }

    getClientChat(clientId: number){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Chat[]>(`${this.apiUrl}/api/v1/chats/client=` + clientId, {headers});
    }

    getAdminChat(adminId: number){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Chat[]>(`${this.apiUrl}/api/v1/chats/admin=` + adminId, {headers});
    }

    // Mensajes

    getMessages(chatId: number){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Message[]>(`${this.apiUrl}/api/v1/messages/chat=` + chatId, {headers});
    }

    saveMessageDb(chatId:number, userId: number, content: string){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const requestBody = {
        chat_id: chatId, // Replace with actual chat ID
        user_id: userId, // Replace with actual user ID
        content: content
      };

      this.http.post(`${this.apiUrl}/api/v1/messages`, requestBody, {headers}).subscribe(
        response => {

        },
        error => {
          console.error('Error guardando el mensaje en la base de datos');
        }
      );
    }

}
