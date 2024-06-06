import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {

  @Input() message: string | undefined;
  @Input() isHost: boolean | undefined;

  messageClass: string = '';

  ngOnInit(): void {
    this.messageClass = this.isHost ? 'host-message' : 'recipient-message';
  }
}
