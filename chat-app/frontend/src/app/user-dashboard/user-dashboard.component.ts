import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  currentUser: any;
  userGroups: any;
  selectedGroup: any;
  showLeaveGroupModal: boolean = false;

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userGroups = this.currentUser.groups || [];
  }

  openLeaveGroupModal() {
    this.showLeaveGroupModal = true;
  }

  closeLeaveGroupModal() {
    this.showLeaveGroupModal = false;
  }

  async leaveGroup() {
    if (this.selectedGroup && this.currentUser && this.currentUser._id) {
      const userId = this.currentUser._id;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/groups/leave', 
        {
          userId: this.currentUser._id,
          groupId: this.selectedGroup
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
      );
      alert('Successfully left the group!');
      this.closeLeaveGroupModal();

      this.currentUser.groups = this.currentUser.groups.filter((group: any) => group._id !== this.selectedGroup);
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  
      } catch (error) {
        alert('Error leaving the group.');
      }
    } else {
      alert('Please select a group to leave.');
    }
  }

  //delete user itself
  async deleteAccount() {
    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmation) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete('http://localhost:3000/users/delete', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.status === 200) {
          alert('Your account has been deleted.');
          localStorage.clear();
          window.location.href = '/login';
        } else {
          alert('There was a problem deleting your account.');
        }
      } catch (error) {
        alert('Error deleting the account.');
      }
    }
  }
  
}
