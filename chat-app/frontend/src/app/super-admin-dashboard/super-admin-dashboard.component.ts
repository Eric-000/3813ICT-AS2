import { Component } from '@angular/core';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent {

  constructor() { }

  createGroup() {
    console.log("Create Group")
  }

  createChannel() {
    console.log("Create Group Admin")
  }

  removeEntities() {
    console.log("Create Super Admin")
  }

  deleteChatUser() {
    console.log("Create Chat")
  }

  modifyDeleteGroup() {
    console.log("Create Message")
  }

  banAndReport() {
    console.log("Create Message Group")
  }
}
