export interface IMessage {
    writer: string;
    message: string;
    answer?: IMessage[];
    time: {
        hour: number,
        minute: number,
        day: number,
        month: number,
        year: number,
        dayName: string,
        fullDate: string
    }
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
