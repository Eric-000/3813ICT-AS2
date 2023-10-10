import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent {

  constructor() { }

  users: any[] = [];
  selectedUserId: string = '';
  selectedRole: string = '';

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.users = response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error.response?.data);
    }
  }

  async promoteUser() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/users/assign-role', 
      {
        userId: this.selectedUserId,
        roleName: this.selectedRole
      },
      {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      alert('User promoted successfully!');
    } catch (error: any) {
      console.error('Error promoting user:', error.response?.data);
      alert('Error promoting user. Please try again.');
    }
  }

  openPromoteUserModal() {
    const modal = document.getElementById('promoteUserModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }
  
  closePromoteUserModal() {
    const modal = document.getElementById('promoteUserModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}
