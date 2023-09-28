import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css']
})
export class ChatDashboardComponent {
  title = 'Chatscord';
  socket: Socket;
  messages: { [key: string]: { sender: string, content: string }[] } = {};
  newMessage = '';
  rooms: string[] = [];
  groups?: { name: string }[]
  currentRoom = '';
  currentUser: { 
    username: string,
    email?: string,
    roles?: { name: string, permissions: string[] }[],
    groups?: { name: string }[]
  } = { username: 'Anonymous' };

  constructor(private router: Router) {
    this.socket = io('http://localhost:3000');
    this.joinRoom(this.currentRoom);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!this.currentUser.username) {
      this.currentUser = { username: 'Anonymous' };
    } else {
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
    if (this.currentUser && this.currentUser.groups) {
        this.rooms = this.currentUser.groups.map(group => group.name);
        // create messages object for each room
        this.rooms.forEach(room => {
          if (!this.messages[room]) {
            this.messages[room] = [];
          }
        });
    } else {
        this.rooms = [];
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
    // if (!this.currentUser.username) {
    //   alert('You must be logged in to send messages.');
    //   return;
    // }
    // if (!this.currentRoom) {
    //   alert('You must be in a room to send messages.');
    //   return;
    // }
    if (this.newMessage.trim()) {
      this.socket.emit('sendMessage', {
        content: this.newMessage,
        sender: this.currentUser.username
      }, this.currentRoom);
      this.newMessage = '';
    }
  }

  openUserSettings() {
    // Logic to open user settings
  }
  
  manageGroups() {
    // Logic to manage groups
  }
  
  manageRoomUsers() {
    // Logic to manage room users
  }
  
  manageGroupAdmins() {
    // Logic to manage group admins
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.socket.on('newMessage', (message: { sender: string, content: string }) => {
      this.messages[this.currentRoom].push(message);
    });
  }
}
