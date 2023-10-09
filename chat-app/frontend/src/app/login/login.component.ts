import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  // add router to constructor
  constructor(private router: Router) {}

  async login() {
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        username: this.username,
        password: this.password
      });

      if (response.data && response.data.token) {
        alert('login success!');

        // Store the token and user object in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));

        this.router.navigate(['/chat']);
      } else {
        alert('invalid username or password');
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data);
      alert('Login failed. Please try again.');
    }
  }
}
