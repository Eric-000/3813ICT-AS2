import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-group-admin-dashboard',
  templateUrl: './group-admin-dashboard.component.html',
  styleUrls: ['./group-admin-dashboard.component.css']
})
export class GroupAdminDashboardComponent {
  newGroupName = '';

  createGroupFunction(): void {
    const modal = document.getElementById('createGroupModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  closeCreateGroupModal(): void {
    const modal = document.getElementById('createGroupModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  async onCreateGroup() {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://127.0.0.1:3000/groups/create', 
          {
              name: this.newGroupName
          },
          {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          }
      );
      if (response.data && response.data.groupId) {
        alert('Group created successfully!');
        this.newGroupName = '';
        this.closeCreateGroupModal();
      } else {
        alert('Error creating group. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating group:', error.response?.data);
      alert('Error creating group. Please try again.');
    }
  }
}
