export interface Chat {
  client_id:        number;
  admin_id:         number;
  form_id:          number;
  chat_id:          number;
  chat_name:        string;
  status_id:        number;
  delivery_date:    Date;
  chat_user_admin:  ChatUser;
  chat_user_client: ChatUser;
  chat_form_type:   ChatFormType;
  chat_chat_status: ChatChatStatus;
}

export interface ChatChatStatus {
  status_name: string;
}

export interface ChatFormType {
  form_name: string;
}

export interface ChatUser {
  username: string;
  email:    string;
  phone:    string;
  user_id:  number;
  user_rol: UserRol;
}

export interface UserRol {
  rol_name: string;
  rol_id:   number;
}
