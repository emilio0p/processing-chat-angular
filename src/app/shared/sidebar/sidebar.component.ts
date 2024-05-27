import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Chat } from '../../interfaces/chat.interface';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() chats: Chat[] = []; // Lista de chats (inicializada vacía)
  @Input() user_id: number | undefined;
  @Output() selectedChatChange = new EventEmitter<Chat>();

  constructor(private chatService: ChatService) {} // Inject HttpClient

  ngOnInit() {
    this.getChats();
  }

  getChats() {

    this.chatService.getChats().subscribe(
      chats => {
        this.chats = chats;
      }
    )
  }

  selectChat(chat: Chat) {
    this.selectedChatChange.emit(chat);
  }

  // ... rest of your component code
}

