import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error occurred while fetching users:', err);
        this.errorMessage = 'Failed to load registered users.';
      }
    });
  }
}
