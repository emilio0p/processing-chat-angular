import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { User, UserDTO } from '../../interfaces/user.interface';
import { ChatService } from '../../services/chat.service';
import { Chat, ChatAddDTO } from '../../interfaces/chat.interface';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert'
import swal2 from 'sweetalert2'
import { Observable, map, of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { FormType } from '../../interfaces/form.interface';
import { UserService } from '../../services/user.service';


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

  newUser: UserDTO = {
    username: '',
    email: '',
    phone: '',
    password: '',
    rol_id: 2
  };

  users: User[] = [];
  filteredUsers: User[] = [];
  formTypes: FormType[] = [];

  constructor(private chatService: ChatService, private authService: AuthService, private toastService: ToastrService, private userService: UserService){}

  onChatSelect(chat: Chat) {
    this.chatService.setSelectedChat(chat);
    this.chatSelected.emit(chat);
  }

  ngOnInit(): void {
    this.loadChats();

    if (this.socket) {
      this.socket.on('privateMessage', (message) => {
        this.handlePrivateMessage(message);

      });
    }

    this.loadUsers();

    this.chatService.getFormTypes().subscribe(formTypes => {
      this.formTypes = formTypes;
    });

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
            <input type="tel" id="phoneNumber" class="swal2-input" placeholder="Ej: 691002233" pattern="[0-9]{9}" required>
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

        // Additional email and phone number validation (optional)

        // Email validation using regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          swal2.showValidationMessage('¡Correo electrónico inválido!');
          return;
        }

        // Check email availability before processing user data
        return this.authService.checkEmailExists(email).pipe(
          map((response) => {
            if (!response.is_available) {
              swal2.showValidationMessage('¡El correo electrónico ya está en uso!');
              return null; // Prevent form submission if email is not available
            }
            this.newUser.username = fullName;
            this.newUser.email = email;
            this.newUser.phone = phoneNumber;
            return { fullName, email, phoneNumber }; // Return user data if email is available
          })
        );

      }
    }).then((result) => {
      if (result.isConfirmed) {
        swal2.fire({
          title: '¡Usuario añadido!',
          icon: 'success',
          confirmButtonColor: '#3085d6' // Adjust color as needed
        });

        this.authService.registerUser(this.newUser).subscribe(
          (registeredUser) => {
            this.toastService.success('Usuario registrado en la base de datos','',{
            timeOut: 1500,
            positionClass: 'toast-bottom-right',
            progressBar: true
          });
          },
          (error) => {
            this.toastService.error('Ha habido algún problema al registrarlo en la base de datos','',{
              timeOut: 1500,
              positionClass: 'toast-bottom-right',
              progressBar: true
            });
          }
        );

        setTimeout(() => {
          this.loadUsers();
        }, 1000);

      }
    });
  }


  handlePrivateMessage(message: any) {

    const chatId = message.chatId; // Assuming 'chatId' is included in the message
    const chatIndex = this.chats.findIndex(chat => chat.chat_id === chatId);

    if (chatIndex >= 0) {
      // Move chat to the top of the list
      const chatToMove = this.chats.splice(chatIndex, 1)[0];
      this.chats.unshift(chatToMove);

      // Update last_message and mark as recently messaged
      this.chats[0].last_message = message.content;
    }
  }

  filterUsers(searchTerm: string) {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  createChat() {
    const usersOptions = this.filteredUsers.map(user => `<option value="${user.user_id}">${user.username} | ✉: ${user.email}</option>`).join('');
    const formTypesOptions = this.formTypes.map(type => `<option value="${type.form_id}">${type.form_name}</option>`).join('');

    swal2.fire({
        title: 'Crear Nuevo Chat',
        html: `
            <div class="chat-form" id="chatForm">
            <div class="swal2-row">
            <button id="toggleSearchButton" class="search-button btn btn-primary">Buscar Usuario</button>
                    <input type="text" id="userSearch" class="swal2-input" style="display: none;">
            </div>
                <div class="swal2-row">
                    <label for="user" class="swal2-input-label">Usuario:</label>
                    <select id="user" class="swal2-input">
                        ${usersOptions}
                    </select>
                </div>
                <div class="swal2-row">
                    <label for="formType" class="swal2-input-label">Tipo de Producto:</label>
                    <select id="formType" class="swal2-input">
                        ${formTypesOptions}
                    </select>
                </div>
                <div class="swal2-row">
                    <label for="date" class="swal2-input-label">Fecha de Entrega:</label>
                    <input type="date" id="date" class="swal2-input" required>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#c03e4b',
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        customClass: {
            container: 'swal2-container-responsive',
            popup: 'swal2-popup-responsive',
            confirmButton: 'swal2-confirm-button-responsive',
            cancelButton: 'swal2-cancel-button-responsive',
        },
        preConfirm: () => {
            const userElement = document.getElementById('user') as HTMLSelectElement;
            const formTypeElement = document.getElementById('formType') as HTMLSelectElement;
            const dateElement = document.getElementById('date') as HTMLInputElement;

            const userId = userElement.value;
            const formTypeId = formTypeElement.value;
            const date = dateElement.value;

            if (!userId || !formTypeId || !date) {
                swal2.showValidationMessage('¡Por favor, completa todos los campos!');
                return;
            }

            return {
                userId,
                formTypeId,
                date
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            swal2.fire({
                title: '¡Chat creado!',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
            // Lógica para crear el chat
            const newChat: ChatAddDTO = {
                client_id: result.value.userId,
                form_id: result.value.formTypeId,
                delivery_date: result.value.date
            }

            this.chatService.saveNewChat(newChat);
            setTimeout(() => {
                this.loadChats();
            }, 1000);
        }
    });

    // Mostrar el campo de búsqueda y filtrar usuarios
    const toggleSearchButton = document.getElementById('toggleSearchButton') as HTMLButtonElement;
    const inputElement = document.getElementById('userSearch') as HTMLInputElement;

    toggleSearchButton.addEventListener('click', () => {
        inputElement.style.display = inputElement.style.display === 'none' ? 'block' : 'none';
    });

    inputElement.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        this.filterUsers(target.value);
        const usersOptions = this.filteredUsers.map(user => `<option value="${user.user_id}">${user.username} ✉:${user.email}</option>`).join('');
        const selectElement = document.getElementById('user') as HTMLSelectElement;
        selectElement.innerHTML = usersOptions;
    });
}


  loadChats(){
    if(this.user){
      if(this.user.user_rol.rol_name==="user"){
        this.getChatsForClient(this.user.user_id);
      } else {
        this.getChatsForAdmin(this.user.user_id);
      }
    }
  }

  loadUsers(){
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  changePassword(){
    swal2.fire({
      title: 'Cambiar contraseña',
      html: `
        <form id="userForm">
          <div class="swal2-row">
            <label for="firstPass" class="swal2-input-label">Nueva contraseña:</label>
            <input type="password" id="firstPass" class="swal2-input" required>
          </div>
          <div class="swal2-row">
            <label for="secondPass" class="swal2-input-label">Confirmar contraseña:</label>
            <input type="password" id="secondPass" class="swal2-input" required>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // Adjust color as needed
      cancelButtonColor: '#d33', // Adjust color as needed
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const firstPassElement = document.getElementById('firstPass') as HTMLInputElement;
        const secondPassElement = document.getElementById('secondPass') as HTMLInputElement;
        const firstPass = firstPassElement.value;
        const secondPass = secondPassElement.value;

        if (!firstPass || !secondPass) {
          swal2.showValidationMessage('¡Por favor, completa todos los campos!');
          return;
      }

      if (firstPass !== secondPass) {
          swal2.showValidationMessage('¡Las contraseñas no coinciden!');
          return;
      }

      if(firstPass.length<6){
        swal2.showValidationMessage('¡La contraseña es insegura!');
        return;
      }

      return {
          firstPass
      };

      }
    }).then((result) => {
      if (result.isConfirmed) {


        if(this.user){
          const userData: UserDTO = {
            username : this.user?.username,
            email: this.user.email,
            phone: this.user.phone,
            password: result.value.firstPass,
            rol_id: this.user.user_id
          }

          this.authService.changeUserPass(this.user.user_id, userData).subscribe(
            (response) => {
              swal2.fire({
                title: '¡Contraseña cambiada!',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                timer: 3000,
                timerProgressBar: true // Adjust color as needed
              });

              this.authService.logout('Has cambiado a contraseña, vuelve a iniciar sesión');
            },
            (error) => {
                  this.toastService.error('Ha habido algún problema al registrarlo en la base de datos','',{
                    timeOut: 1500,
                    positionClass: 'toast-bottom-right',
                    progressBar: true
                  });
                }
          )
        }


        // LÓGICA API
        // this.authService.registerUser(this.newUser).subscribe(
        //   (registeredUser) => {
        //     this.toastService.success('Usuario registrado en la base de datos','',{
        //     timeOut: 1500,
        //     positionClass: 'toast-bottom-right',
        //     progressBar: true
        //   });
        //   },
        //   (error) => {
        //     this.toastService.error('Ha habido algún problema al registrarlo en la base de datos','',{
        //       timeOut: 1500,
        //       positionClass: 'toast-bottom-right',
        //       progressBar: true
        //     });
        //   }
        // );



      }
    });
  }

}


