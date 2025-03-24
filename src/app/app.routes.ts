import { Routes } from '@angular/router';
import { MainChatComponent } from './main/main-chat/main-chat.component';
import { DirectChatComponent } from './main/direct-chat/direct-chat.component';
import { LegalNoticeComponent } from './shared/legal-notice/legal-notice.component';
import { ImprintComponent } from './shared/imprint/imprint.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SelectAvatarComponent } from './auth/select-avatar/select-avatar.component';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", outlet: "login-router", component: LoginComponent },
    { path: "register", outlet: "login-router", component: RegisterComponent },
    { path: "avatar", outlet: "login-router", component: SelectAvatarComponent },
    { path: "legal", outlet: "login-router", component: LegalNoticeComponent },
    { path: "imprint", outlet: "login-router", component: ImprintComponent },
    { path: "main", component: MainChatComponent },
    { path: "direct", component: DirectChatComponent },
];
