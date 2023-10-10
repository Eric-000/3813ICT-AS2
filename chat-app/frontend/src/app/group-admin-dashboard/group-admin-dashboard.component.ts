import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-group-admin-dashboard',
  templateUrl: './group-admin-dashboard.component.html',
  styleUrls: ['./group-admin-dashboard.component.css']
})
export class GroupAdminDashboardComponent {

  // assgin user to group states
  users: any[] = [];
  selectedUserId: string = '';
  selectedGroupIdForAssignment: string = '';

  // add channel to group states
  newChannelName = '';
  selectedGroupId = '';
  groups: any[] = [];

  // create channel states
  newGroupName = '';

  // remove user from group states
  selectedUserIdForRemoval: string = '';
  selectedGroupIdForRemoval: string = '';

  // delete group states
  selectedGroupIdForDeletion: string = '';


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

      const response = await axios.post('http://localhost:3000/groups/create', 
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

  // Channel functions
  async openCreateChannelModal() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/groups/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        this.groups = response.data;

        const modal = document.getElementById('createChannelModal');
        if (modal) {
            modal.style.display = 'block';
        }
    } catch (error: any) {
        console.error('Error fetching groups:', error.response?.data);
        alert('Error fetching groups. Please try again.');
    }
  }

  closeCreateChannelModal(): void {
    const modal = document.getElementById('createChannelModal');
    if (modal) {
        modal.style.display = 'none';
    }
    this.newChannelName = '';
    this.selectedGroupId = '';
  }

  async onCreateChannel() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/channels/create', 
            {
                name: this.newChannelName,
                groupId: this.selectedGroupId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (response.data && response.data.channel) {
            alert('Channel created successfully!');
            this.newChannelName = '';
            this.closeCreateChannelModal();
        } else {
            alert('Error creating channel. Please try again.');
        }
    } catch (error: any) {
        console.error('Error creating channel:', error.response?.data);
        alert('Error creating channel. Please try again.');
    }
  }

  // Open the modal to assign a user to a group
  async openAssignUserToGroupModal() {
    try {
        const token = localStorage.getItem('token');

        // Fetch all users with role 'User'
        const usersResponse = await axios.get('http://localhost:3000/users/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await axios.get('http://localhost:3000/groups/all', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });
        
        this.groups = response.data;
        this.users = usersResponse.data;

        // Open the modal
        const modal = document.getElementById('assignUserToGroupModal');
        if (modal) {
            modal.style.display = 'block';
        }
    } catch (error: any) {
        console.error('Error fetching users:', error.response?.data);
        alert('Error fetching users. Please try again.');
    }
  }

  closeAssignUserToGroupModal(): void {
      const modal = document.getElementById('assignUserToGroupModal');
      this.selectedUserId = '';
      this.selectedGroupIdForAssignment = '';
      this.users = [];
      this.groups = [];

      if (modal) {
          modal.style.display = 'none';
      }
  }

  async onAssignUserToGroup() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/groups/assign', 
            {
                userId: this.selectedUserId,
                groupId: this.selectedGroupIdForAssignment
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (response.data && response.data.success) {
            alert('User successfully assigned to the group!');
            this.closeAssignUserToGroupModal();
        } else {
            alert('Error assigning user to the group. Please try again.');
        }
    } catch (error: any) {
        console.error('Error assigning user to group:', error.response?.data);
        alert('Error assigning user to group. Please try again.');
    }
  }

  // Remove user from group functions
  async openRemoveUserFromGroupModal() {
    try {
        const token = localStorage.getItem('token');
  
        // Fetch all users with role 'User' (or all users, based on your need)
        const usersResponse = await axios.get('http://localhost:3000/users/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
  
        const response = await axios.get('http://localhost:3000/groups/all', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
        });
        
        this.groups = response.data;
        this.users = usersResponse.data;
  
        // Open the modal
        const modal = document.getElementById('removeUserFromGroupModal');
        if (modal) {
            modal.style.display = 'block';
        }
    } catch (error: any) {
        console.error('Error fetching users:', error.response?.data);
        alert('Error fetching users. Please try again.');
    }
  }
  
  closeRemoveUserFromGroupModal(): void {
      const modal = document.getElementById('removeUserFromGroupModal');
      if (modal) {
          modal.style.display = 'none';
      }
      this.selectedUserIdForRemoval = '';
      this.selectedGroupIdForRemoval = '';
  }

  async onRemoveUserFromGroup() {
    if (this.selectedGroupIdForRemoval && this.selectedUserIdForRemoval) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/groups/leave', 
        {
          userId: this.selectedUserIdForRemoval,
          groupId: this.selectedGroupIdForRemoval
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
      );
      alert('Successfully left the group!');
      this.closeRemoveUserFromGroupModal();
  
      } catch (error) {
        alert('Error leaving the group.');
      }
    } else {
      alert('Please select a group to leave.');
    }
  }

  // delete group functions
  async onDeleteGroup() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/groups/delete', 
        {
          groupId: this.selectedGroupIdForDeletion
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.data && response.data.success) {
        alert('Group deleted successfully!');
        this.closeDeleteGroupModal();
      } else {
        alert('Error deleting group. Please try again.');
      }
    } catch (error: any) {
      console.error('Error deleting group:', error.response?.data);
      alert('Error deleting group. Please try again.');
    }
  }
  
  async openDeleteGroupModal() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/groups/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      this.groups = response.data;
  
      const modal = document.getElementById('deleteGroupModal');
      if (modal) {
        modal.style.display = 'block';
      }
    } catch (error: any) {
      console.error('Error fetching groups:', error.response?.data);
      alert('Error fetching groups. Please try again.');
    }
  }
  
  
  closeDeleteGroupModal() {
    const modal = document.getElementById('deleteGroupModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.selectedGroupIdForDeletion = '';
  }
  
}
