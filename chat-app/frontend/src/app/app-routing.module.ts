import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent} from './register/register.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { GroupAdminDashboardComponent } from './group-admin-dashboard/group-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'chat', component: ChatDashboardComponent },
  { path: 'user', component: UserDashboardComponent },
  { path: 'groupAdmin', component: GroupAdminDashboardComponent },
  { path: 'superAdmin', component: SuperAdminDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
