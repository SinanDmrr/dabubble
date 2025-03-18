export interface IMessage {
    writer: string;
    message: string;
    answer: string[];    
}

export interface IChannels {
    creator: string;
    description: string;
    id?: string;
    messages: IMessage[];
    name: string;
    users: string[];
}
