import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat.interface';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  @Input() user: User | undefined;
  chats: Chat[] = [];
  search: string = '';
  @Output() chatSelected = new EventEmitter<Chat>();

  constructor(private chatService: ChatService){}

  onChatSelect(chat: Chat) {
    this.chatSelected.emit(chat);
  }

  ngOnInit(): void {
    if(this.user){
      if(this.user.user_rol.rol_name==="user"){
        this.getChatsForClient(this.user.user_id);
        console.log(this.chats);
      } else {
        // TODO PARA LOS ADMINS
      }

    }

  }

  get filteredChats() {
    return this.chats.filter(chat =>
      chat.chat_form_type.form_name.toLocaleLowerCase().includes(this.search.toLowerCase()) ||
      chat.chat_user_admin.username.toLocaleLowerCase().includes(this.search.toLowerCase())
    );
  }

  getChatsForClient(clientId: number): void {
    this.chatService.getClientChat(clientId).subscribe(
      chats => {
        this.chats = chats;
      },
      error => {
        console.error('Error fetching chats:', error);
      }
    );
  }


}

