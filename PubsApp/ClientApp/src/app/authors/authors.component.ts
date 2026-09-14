import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html'
})
export class AuthorsComponent implements OnInit {
  public authors: Author[] = [];
  public currentAuthor: Author = this.getEmptyAuthor();
  public isEditing: boolean = false;
  public showForm: boolean = false;

  public errorMessage: string = '';
  public successMessage: string = '';

  private baseUrl: string;

  constructor(private http: HttpClient, public authService: AuthService, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.loadAuthors();
  }

  loadAuthors() {
    this.http.get<Author[]>(this.baseUrl + 'api/Authors').subscribe({
      next: (result) => { this.authors = result; },
      error: (err) => { this.showError('Failed to load authors from the server.'); }
    });
  }

  openNewForm() {
    this.currentAuthor = this.getEmptyAuthor();
    this.isEditing = false;
    this.showForm = true;
    this.clearMessages();
  }

  editAuthor(author: Author) {
    this.currentAuthor = { ...author };
    this.isEditing = true;
    this.showForm = true;
    this.clearMessages();
  }

  cancelForm() {
    this.showForm = false;
    this.clearMessages();
  }

  saveAuthor() {

    if (!this.isEditing && (!this.currentAuthor.auId || this.currentAuthor.auId.length < 9)) {
      this.showError('Author ID must be in a specific format (e.g. 123-45-6789).');
      return;
    }

    if (this.isEditing) {
      this.http.put(this.baseUrl + 'api/Authors/' + this.currentAuthor.auId, this.currentAuthor).subscribe({
        next: () => {
          this.showSuccess('Author updated successfully.');
          this.showForm = false;
          this.loadAuthors();
        },
        error: (err) => { this.showError('Failed to update author. Please check your data.'); }
      });
    } else {
      this.http.post<Author>(this.baseUrl + 'api/Authors', this.currentAuthor).subscribe({
        next: () => {
          this.showSuccess('New author added successfully.');
          this.showForm = false;
          this.loadAuthors();
        },
        error: (err) => { this.showError('Failed to add author. ID might already exist.'); }
      });
    }
  }

  deleteAuthor(id: string) {
    if (confirm('Are you sure you want to delete this author?')) {
      this.http.delete(this.baseUrl + 'api/Authors/' + id).subscribe({
        next: () => {
          this.showSuccess('Author deleted successfully.');
          this.loadAuthors();
        },
        error: (err) => { this.showError('Failed to delete author. They might be linked to a title.'); }
      });
    }
  }

  getEmptyAuthor(): Author {
    return {
      auId: '',
      auLname: '',
      auFname: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      contract: false
    };
  }

  showError(msg: string) {
    this.errorMessage = msg;
    this.successMessage = '';
  }

  showSuccess(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}

interface Author {
  auId: string;
  auLname: string;
  auFname: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contract: boolean;
}
