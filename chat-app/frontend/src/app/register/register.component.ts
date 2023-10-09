import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';

  // add route
  constructor(private router: Router) {}

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/users/register', {
        username: this.username,
        password: this.password,
        email: this.email
      });
  
      console.log('Registration successful:', response);
  
      const token = response.data.token;
      const user = response.data.user;
  
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
  
      this.router.navigate(['/chat']);
      alert('Registered successfully!');
  
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data);
      alert('Registration failed. Please try again.');
    }
  }
}

