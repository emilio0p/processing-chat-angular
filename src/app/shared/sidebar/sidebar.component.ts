import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat.interface';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert'
import swal2 from 'sweetalert2'
import { UserService } from '../../services/user.service';
import { Observable, map, of } from 'rxjs';
import { Socket } from 'socket.io-client';


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
  @Input() socket: Socket | undefined;

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
        this.getChatsForAdmin(this.user.user_id);
      }
    }

    if (this.socket) {
      this.socket.on('privateMessage', (message) => {
        this.handlePrivateMessage(message);
      });
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

  getChatsForAdmin(adminId: number): void {
    this.chatService.getAdminChat(adminId).subscribe(
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

  registerUser() {
    swal2.fire({
      title: 'Añadir Usuario',
      html: `
        <form id="userForm">
          <div class="swal2-row">
            <label for="fullName" class="swal2-input-label">Nombre completo:</label>
            <input type="text" id="fullName" class="swal2-input" placeholder="Ej: Juan Pérez" required>
          </div>
          <div class="swal2-row">
            <label for="email" class="swal2-input-label">Correo electrónico:</label>
            <input type="email" id="email" class="swal2-input" placeholder="Ej: juan.perez@example.com" required>
          </div>
          <div class="swal2-row">
            <label for="phoneNumber" class="swal2-input-label">Teléfono:</label>
            <input type="tel" id="phoneNumber" class="swal2-input" placeholder="Ej: 691002233" pattern="[0-9]{9}">
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Adjust color as needed
      cancelButtonColor: '#d33', // Adjust color as needed
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const userForm = document.getElementById('userForm') as HTMLFormElement;
        if (!userForm.checkValidity()) {
          swal2.showValidationMessage('¡Por favor, revisa los campos!');
          return;
        }

        const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement).value;

        // Additional email and phone number validation (optional):

        if(!this.emailUnique(email)){
          swal2.showValidationMessage('¡Email existente!');
          return;
        }

        // Email validation using regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          swal2.showValidationMessage('¡Correo electrónico inválido!');
          return;
        }

        // Comprobar que ese email no esté registrado

        // Process user data here, e.g., call your API to add the user

        return {
          fullName,
          email,
          phoneNumber
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        swal2.fire({
          title: '¡Usuario añadido!',
          icon: 'success',
          confirmButtonColor: '#3085d6' // Adjust color as needed
        });
      }
    });
  }

  emailUnique(email: string): Observable<boolean> {
    return this.authService.checkEmailExists(email).pipe(
      map(isEmailAvailable => isEmailAvailable),
      // El operador `map` transforma el resultado de la subscripción (isEmailAvailable)
      // en el valor booleano opuesto, es decir, devuelve true si el email no está disponible,
      // y false si lo está.
      error => {
        console.error('Error checking email existence:', error);
        return of(false); // En caso de error, devolver false
      }
    );
  }

  handlePrivateMessage(message: any) {

    const chatId = message.chatId; // Assuming 'chatId' is included in the message
    const chatIndex = this.chats.findIndex(chat => chat.chat_id === chatId);

    if (chatIndex >= 0) {
      this.chats[chatIndex].last_message = message.content; // Update last_message
    }
  }




}




