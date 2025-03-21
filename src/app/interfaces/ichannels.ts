export interface IMessage {
    writer: string;
    message: string;
    answer?: IMessage[];
    time: any;
    emojis: IEmojis[];
}

export interface IEmojis {
    unicode: string;
    username: string;
    count: number;
}

export interface IChannels {
    creator: string;
    description: string;
    id?: string;
    messages: IMessage[];
    name: string;
    users: string[];
}
