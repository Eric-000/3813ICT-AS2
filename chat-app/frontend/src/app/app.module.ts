import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { GroupAdminDashboardComponent } from './group-admin-dashboard/group-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { VideoRoomComponent } from './video-room/video-room.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatDashboardComponent,
    RegisterComponent,
    UserDashboardComponent,
    GroupAdminDashboardComponent,
    SuperAdminDashboardComponent,
    VideoRoomComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
