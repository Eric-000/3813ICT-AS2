import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'chat-frontend-angular';

  ngOnInit() {
    const fakeUsers = [
      {
        _id: 1,
        username: 'SuperAdminUser',
        email: 'superadmin@example.com',
        password: 'password123',
        role: ['Super Admin'],
        permissions: [
          "promote_to_group_admin",
          "remove_any_chat_users",
          "upgrade_to_super_admin",
          "all_group_admin_functions"
        ],
        groups: [
          { name: 'Room 1'},
          { name: 'Room 2'},
          { name: 'Room 3'},
        ]
      },
      {
        _id: 2,
        username: 'GroupAdminUser',
        email: 'groupadmin@example.com',
        password: 'password123',
        role: ['Group Admin'],
        permissions: [
          "create_groups", 
          "create_channels",
          "remove_groups_channels_users",
          "delete_chat_users",
          "modify_delete_own_group",
          "ban_user_from_channel",
          "report_to_super_admin"
        ],
        groups: [
          { name: 'Room 1'},
          { name: 'Room 2'},
          { name: 'Room 3'},
          { name: 'Room 4'},
          { name: 'Room 5'},
          { name: 'Room 6'},
        ]
      },
      {
        _id: 3,
        username: 'NormalUser',
        email: 'normaluser@example.com',
        password: 'password123',
        role: ['User'],
        permissions: [
          "create_chat_user",
          "join_any_channel_in_group",
          "register_interest_in_group",
          "leave_group", "delete_self"
        ],
        groups: [
          { name: 'Room 1'},
          { name: 'Room 2'},
          { name: 'Room 3'},
          { name: 'Room 4'},
          { name: 'Room 5'},
          { name: 'Room 6'},
        ]
      }
    ];

    // save to local storage
    localStorage.setItem('fakeUsers', JSON.stringify(fakeUsers));
  }
}