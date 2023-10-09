import { Component, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';
import { ActivatedRoute } from '@angular/router';

interface VideoStream {
  stream: MediaStream;
  peerId: string;
}

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.css']
})

export class VideoRoomComponent implements AfterViewInit {
  peer: Peer | undefined;
  socket: Socket;
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  remoteVideos: VideoStream[] = [];
  localStream?: MediaStream;
  roomId: string;
  onlineUsers: any[] = [];
  userId: string = '';
  username: string = '';

  constructor(private ngZone: NgZone, private route: ActivatedRoute) {
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    console.log("Joined Room:", this.roomId);

    const user = JSON.parse(localStorage.getItem('currentUser')!);
    if (user && user._id) {
      this.userId = user._id;
      this.username = user.username;
      console.log('username:', this.username);
      console.log('roomid:', this.roomId);
      console.log('Logged in User ID:', this.userId);
    }

    this.peer && this.peer.destroy(); 
    
    this.peer = new Peer({
      host: 'localhost',
      port: 3000,
      path: '/peerjs/myapp'
    });

    this.socket = io('http://localhost:3000'); 

    this.peer.on('open', id => {
      console.log('My peer ID is:', id);
      this.socket.emit('join-video-room', { peerId: id, roomId: this.roomId, username: this.username });
    });
  
    this.socket.on('update-users', (users: any[]) => {
      console.log('Received updated user list:', users);
      this.onlineUsers = users;
      this.onlineUsers.forEach(user => {
          if (user.peerId !== this.peer?.id && !this.remoteVideos.some(rv => rv.peerId === user.peerId) && this.localStream) {
              const call = this.peer?.call(user.peerId, this.localStream);
              if(call) {
                  call.on('stream', remoteStream => {
                      this.ngZone.run(() => {
                          if (!this.remoteVideos.some(rv => rv.peerId === user.peerId)) {
                              this.remoteVideos.push({ stream: remoteStream, peerId: user.peerId });
                          }
                      });
                  });
              }
          }
      });
    });

    this.socket.on('user-left', (data: { peerId: string }) => {
      const index = this.remoteVideos.findIndex(rv => rv.peerId === data.peerId);
      if (index !== -1) {
          this.ngZone.run(() => {
              this.remoteVideos.splice(index, 1);
          });
      }
    });

    window.addEventListener('beforeunload', () => {
      if (this.peer && this.peer.id) {
        this.socket.emit('leave-video-room', { peerId: this.peer.id, roomId: this.roomId });
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      // Get user media for video and audio
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.myVideo.nativeElement.srcObject = stream;
      this.localStream = stream;
  
      // Answering a call
      this.peer?.on('call', call => {
        call.answer(this.localStream!);
        call.on('stream', remoteStream => {
          this.ngZone.run(() => {
            if (!this.remoteVideos.some(rv => rv.peerId === call.peer)) {  // Check if the stream is not already added
              this.remoteVideos.push({ stream: remoteStream, peerId: call.peer });
            }
          });
        });
      });      
    } catch (error) {
      console.error('Media Device Error:', error);
    }
  }
  
  
  ngOnDestroy(): void {
    if (this.peer && this.peer.id) {
      this.socket.emit('leave-video-room', { peerId: this.peer.id, roomId: this.roomId });
    }
  }
}
