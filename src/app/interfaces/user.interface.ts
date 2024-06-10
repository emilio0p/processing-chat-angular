export interface User {
  username: string;
  email:    string;
  phone:    string;
  user_id:  number;
  user_rol: UserRol;
}

export interface UserDTO {
  username: string;
  email:    string;
  phone:    string;
  password: string;
  rol_id: number;
}

export interface UserRol {
  rol_name: string;
  rol_id:   number;
}
