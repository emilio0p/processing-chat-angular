import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chat, ChatAddDTO, ChatEditStatusDTO } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { BehaviorSubject, Observable, combineLatest, first, map, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormType } from '../interfaces/form.interface';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private http: HttpClient, private toastrService: ToastrService) {

    }

    apiUrl = environment.apiUrl;

    private selectedChatSource = new BehaviorSubject<Chat | undefined>(undefined);
    selectedChat$ = this.selectedChatSource.asObservable();

    setSelectedChat(chat: Chat) {
      this.selectedChatSource.next(chat);
    }

    // Chats

    getChats() {
        return this.http.get<Chat[]>(`${this.apiUrl}/api/v1/chats/`);
    }

    getFormTypes(){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<FormType[]>(`${this.apiUrl}/api/v1/chats/form-types`, {headers});
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

    getLastMessage(chatId: number){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Message>(`${this.apiUrl}/api/v1/messages/lm/` + chatId, {headers});
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
        chat_id: chatId,
        user_id: userId,
        content: content
      };

      this.http.post(`${this.apiUrl}/api/v1/messages/`, requestBody, {headers}).subscribe(
        response => {

        },
        error => {
          console.error('Error guardando el mensaje en la base de datos');
        }
      );
    }

    saveNewChat(chatData: ChatAddDTO){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(`${this.apiUrl}/api/v1/chats/`, chatData, {headers}).subscribe(
        respones => {

        },
        error => {
          console.error('Error guardar el chat en la base de datos');

        }
      );
    }

    changeStatus(chatId: number, chatData: ChatEditStatusDTO){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.put(`${this.apiUrl}/api/v1/chats/` + chatId, chatData, {headers}).subscribe(
      response => {
        this.toastrService.success('¡Estado actualizado!','',{
          timeOut: 1500,
          positionClass: 'toast-bottom-right',
          progressBar: true
        });
      },
      error => {
      }
    )
    }

    deleteChat(chatId: number){
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.delete(`${this.apiUrl}/api/v1/chats/` + chatId, {headers}).subscribe(
      response => {
        this.toastrService.success('¡Chat eliminado, redirigiendo...!','',{
          timeOut: 1500,
          positionClass: 'toast-bottom-right',
          progressBar: true
        });
      },
      error => {
      }
    )
    }

}
