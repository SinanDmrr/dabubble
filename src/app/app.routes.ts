import { Routes } from '@angular/router';
import { MainChatComponent } from './main/main-chat/main-chat.component';
import { DirectChatComponent } from './main/direct-chat/direct-chat.component';

export const routes: Routes = [
    { path: "", component: MainChatComponent},
    { path: "main", component: MainChatComponent},
    { path: "direct", component: DirectChatComponent},
];
