import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarPictureService {

  constructor() { }

  avatarPictures = [
    "assets/avatars/avatar_1_high.png",
    "assets/avatars/avatar_2_high.png",
    "assets/avatars/avatar_3_high.png",
    "assets/avatars/avatar_4_high.png",
    "assets/avatars/avatar_5_high.png",
    "assets/avatars/avatar_6_high.png"
  ]
}
