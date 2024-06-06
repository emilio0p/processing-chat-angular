export interface Message {
  chat_id:    number;
  user_id:    number;
  content:    string;
  timestamp: Date;
}

export interface MessageAddDTO {
  chat_id:    number;
  user_id:    number;
  content:    string;
}
