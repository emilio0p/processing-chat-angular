import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Chat } from '../../interfaces/chat.interface';
import { Socket, io } from 'socket.io-client';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrl: './client-main.component.css'
})
export class ClientMainComponent implements OnInit{


  user: User | undefined;
  selectedChat: Chat | undefined;
  socket: Socket | undefined;
  showSidebar: boolean = true;
  isMobile: boolean = false;
  serverUrl = environment.socketServiceUrl;

  constructor(private userService: UserService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {

    this.breakpointObserver.observe([Breakpoints.Handset])
    .subscribe(result => {
      this.isMobile = result.matches;
    });

    this.userService.getUser().subscribe(
      user => {
        this.user = user;
        this.socket = io(`${this.serverUrl}` , { query: { userId: this.user.user_id } });
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );


  }

  onChatSelected(chat: Chat){
    this.selectedChat=chat;
    if(this.isMobile){
      this.showSidebar=false;
    }
  }

  toggleSidebar(){
    this.showSidebar = !this.showSidebar;
  }



}
