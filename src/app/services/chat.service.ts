import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../interfaces/chat.interface';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private http: HttpClient) { }

    getChats() {
        return this.http.get<Chat[]>("http://127.0.0.1:8000/api/v1/chats");
    }

    getClientChat(clientId: number){
      return this.http.get<Chat[]>("http://127.0.0.1:8000/api/v1/chats/client=" + clientId);
    }

//     # Petición GET "/api/v1/chats/client_id"
// @chat_router.get("/client={client_id:int}", response_model=list[ActiveChatDTO])
// async def find_chat_by_client(client_id:int, db: Session = Depends(get_db)):
//     return search_chat_by_client(client_id, db)

// # Petición GET "/api/v1/chats/admin_id"
// @chat_router.get("/admin={admin_id:int}", response_model=list[ActiveChatDTO])
// async def find_chat_by_admin(admin_id:int, db: Session = Depends(get_db)):
//     return search_chat_by_admin(admin_id, db)

}
