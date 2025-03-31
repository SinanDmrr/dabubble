import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarPictureService {

  constructor() { }

  avatarPictures = [
    "assets/avatars/avatar_1_round.png",
    "assets/avatars/avatar_2_round.png",
    "assets/avatars/avatar_3_round.png",
    "assets/avatars/avatar_4_round.png",
    "assets/avatars/avatar_5_round.png",
    "assets/avatars/avatar_6_round.png"
  ]
}
