export interface IMessage {
  writer: string;
  message: string;
  answer?: IMessage[];
  time: {
    hour: number;
    minute: number;
    day: number;
    month: number;
    year: number;
    dayName: string;
    fullDate: string;
  };
  emojis: IEmojis[];
}

export interface IEmojis {
  unicode: string;
  username: string;
  count: number;
}

export interface IDirectMessage {
  sender: string;
  receiver: string;
  messages: IMessage[];
  id?: string;
}
