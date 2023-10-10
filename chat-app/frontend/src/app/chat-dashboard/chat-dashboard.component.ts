import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';
import axios from 'axios';

type Channel = {
  _id: string;
  name: string;
  __v?: number;
};

type Group = {
  _id: string;
  name: string;
  channels: Channel[];
  createdBy: string;
  __v?: number;
};

type Role = {
  _id: string;
  name: string;
  permissions: string[];
  __v?: number;
};

type User = {
  _id: string;
  username: string;
  email?: string;
  roles?: Role[];
  groups?: Group[];
  profileImage?: string;
  __v?: number;
};

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css']
})

export class ChatDashboardComponent {
  title = 'Chatscord';
  socket: Socket;
  messages: { [key: string]: { sender: string, content: string, avatar: string }[] } = {};
  newMessage = '';
  rooms: string[] = [];
  groups?: { name: string }[]
  currentRoom = '';
  currentUser: User = { _id: '', username: 'Anonymous' };

  constructor(private router: Router) {
    this.socket = io('http://localhost:3000');
    this.joinRoom(this.currentRoom);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.currentUser.username) {
      this.updateRoomsBasedOnUser();
      // set current room to first room in list
      if (this.rooms.length > 0) {
        this.currentRoom = this.rooms[0];
        this.joinRoom(this.currentRoom);
      }
    }
  }

  hasPermission(permission: string): boolean {
    if (this.currentUser && this.currentUser.roles) {
      return this.currentUser.roles.some(role => role.permissions.includes(permission));
    }
    return false;
  }

  hasRole(targetRole: string): boolean {
    if (this.currentUser && this.currentUser.roles) {
      return this.currentUser.roles.some(role => role.name === targetRole);
    }
    return false;
  }

  updateRoomsBasedOnUser() {
    this.rooms = [];
    if (this.currentUser && this.currentUser.groups) {
        this.currentUser.groups.forEach(group => {
            if (group.channels) {
                group.channels.forEach(channel => {
                    this.rooms.push(channel.name);
                    if (!this.messages[channel.name]) {
                        this.messages[channel.name] = [];
                    }
                });
            }
        });
    }
  } 

  joinRoom(room: string) {
    if (this.currentRoom) {
      this.socket.emit('leave', this.currentRoom);
    }
    this.currentRoom = room;
    // if doesn't exist, create one
    if (!this.messages[this.currentRoom]) {
      this.messages[this.currentRoom] = [];
    }
    this.socket.emit('join', room);
  }

  sendMessage() {
    if (!this.currentUser.username) {
      alert('You must be logged in to send messages.');
      return;
    }
    if (!this.currentRoom) {
      alert('You must be in a room to send messages.');
      return;
    }
    if (this.newMessage.trim()) {
      this.socket.emit('sendMessage', {
        content: this.newMessage,
        sender: this.currentUser.username,
        avatar: this.currentUser.profileImage ? 'http://localhost:3000/' + this.currentUser.profileImage : '' 
      }, this.currentRoom);
      this.newMessage = '';
    }
  }

  gotoVideoRoom(): void {
    window.open(this.router.createUrlTree(['/video-room', this.currentRoom]).toString(), '_blank');
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.socket.on('newMessage', (message: { sender: string, content: string, avatar: string }) => {
      this.messages[this.currentRoom].push(message);
    });

    this.socket.on('receiveImage', (data: {image: string, sender: string, avatar: string}) => {
      this.messages[this.currentRoom].push({
        sender: data.sender,
        content: `<img src="${data.image}" alt="Chat Image" style="max-width: 100%; height: auto;">`,
        avatar: data.avatar
      });
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      this.uploadFile(file);
    }
  }
  
  async uploadFile(file: File) {
    const uploadData = new FormData();
    uploadData.append('profileImage', file, file.name);
  
    try {
      const response = await axios.post('http://localhost:3000/users/uploadProfileImage', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
  
      this.currentUser.profileImage = response.data.imagePath;
      
      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  // attach chat image
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const base64Image = e.target.result;
            this.sendImage(base64Image);
        };
        reader.readAsDataURL(file);
    }
  }

  // send chat image
  sendImage(base64Image: string) {
    if (!this.currentUser.username) {
        alert('You must be logged in to send images.');
        return;
    }
    if (!this.currentRoom) {
        alert('You must be in a room to send images.');
        return;
    }
    console.log('sending image', base64Image);
    this.socket.emit('sendImage', {
        image: base64Image,
        sender: this.currentUser.username,
        avatar: this.currentUser.profileImage ? 'http://localhost:3000/' + this.currentUser.profileImage : '' 
    }, this.currentRoom);
  }

}
