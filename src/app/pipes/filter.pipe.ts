import { Pipe, PipeTransform } from '@angular/core';
import { Chat } from '../interfaces/chat.interface';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {

  transform(chats: Chat[], searchTerm: string): Chat[] {
    if (!searchTerm) {
      return chats; // Return all chats if no search term is provided
    }

    const filteredChats = chats.filter(chat => {
      // Search in multiple chat properties (case-insensitively)
      return (
        chat.chat_form_type.form_name.toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.chat_user_admin.username.toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.chat_user_client.username.toLocaleLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.chat_chat_status.status_name.toLocaleLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    return filteredChats;
  }
}
