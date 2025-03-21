import { Component, input } from '@angular/core';
import { WriteMessageComponent } from '../../shared/write-message/write-message.component';
import { ChannelsService } from '../../services/channels.service';
import { Observable } from 'rxjs';
import { IChannels } from '../../interfaces/ichannels';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../../shared/profile/profile.component';

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [WriteMessageComponent, EditChannelComponent, FormsModule, ProfileComponent],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss'
})
export class MainChatComponent {
  messages: string[] = [];
  editOpen: boolean = false;

  members: string[] = ["Frederik Beck (Du)", "Sofia Müller"];

  membersOpen: boolean = false;
  addMemberOpen: boolean = false;
  memberToAdd: string = "";
  membersAdded: string[] = [];
  exampleMembers: string[] = ["Frederik Beck (Du)", "Sofia Müller", "Noah Braun", "Elise Roth", "Elias Neumann", "Steffen Hoffmann"];
  inputValid = false;

  profileOpen = false;
  constructor(private channelService: ChannelsService) {

  }

  addMessage(newMessage: string) {
    this.messages.push(newMessage);
  }

  openEdit() {
    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
  }

  openMembers() {
    this.membersOpen = true;
  }

  closeMembers() {
    this.membersOpen = false;
  }

  openAddMember() {
    this.addMemberOpen = true;
  }

  closeAddMember() {
    this.addMemberOpen = false;
    this.membersAdded = [];
    this.memberToAdd = "";
  }

  openProfile(){
    this.closeMembers();
    this.profileOpen = true;
  }

  closeProfile(){
    this.profileOpen = false;
    this.openMembers();
  }


  goToAddMember(){
    this.closeMembers();
    this.openAddMember();
  }

  addToMembers(){
    this.membersAdded.forEach(newMember => {
      this.members.push(newMember);
    });
    this.closeAddMember();
  }

  addToMembersAdded(newMember?: string){
    if(newMember){
      this.membersAdded.push(newMember);
    } else {
      this.membersAdded.push(this.memberToAdd);
    }
    
    this.memberToAdd = "";
  }

  deleteFromMembersAdded(member: string) {
    let index = this.membersAdded.indexOf(member);
    if (index !== -1) {
      this.membersAdded.splice(index, 1);
    }
  }

  getFilteredMembers(){
    let filteredMembers = this.exampleMembers;
    filteredMembers = filteredMembers.filter(member =>
      member.toLowerCase().includes(this.memberToAdd.toLowerCase()) && !this.membersAdded.includes(member) && !this.members.includes(member)
    );
    return filteredMembers;
  }

  checkIfInputValid(): boolean {
    if(this.membersAdded.length>0){
      return true
    } else {
      return false;
    }
  }

  bubblingProtection(event: any) {
    event.stopPropagation();
  }
}
