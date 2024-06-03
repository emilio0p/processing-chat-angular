import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat.interface';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert'


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

  constructor(private chatService: ChatService, private authService: AuthService){}

  onChatSelect(chat: Chat) {
    this.chatService.setSelectedChat(chat);
    this.chatSelected.emit(chat);
  }

  ngOnInit(): void {
    if(this.user){
      if(this.user.user_rol.rol_name==="user"){
        this.getChatsForClient(this.user.user_id);
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

  logout(){

    swal({
      title: "¿Cerrar sesión?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.authService.logout();
      }
    });
  }


}

