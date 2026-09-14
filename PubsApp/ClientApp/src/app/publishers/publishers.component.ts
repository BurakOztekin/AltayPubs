import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-publishers',
  templateUrl: './publishers.component.html'
})
export class PublishersComponent implements OnInit {
  public publishers: Publisher[] = [];
  public currentPublisher: Publisher = this.getEmptyPublisher();
  public isEditing: boolean = false;
  public showForm: boolean = false;

  public errorMessage: string = '';
  public successMessage: string = '';

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    public authService: AuthService
  ) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.loadPublishers();
  }

  loadPublishers() {
    this.http.get<Publisher[]>(this.baseUrl + 'api/Publishers').subscribe({
      next: (result) => { this.publishers = result; },
      error: (err) => { this.showError('Failed to load publishers from the server.'); }
    });
  }

  openNewForm() {
    this.currentPublisher = this.getEmptyPublisher();
    this.isEditing = false;
    this.showForm = true;
    this.clearMessages();
  }

  editPublisher(pub: Publisher) {
    this.currentPublisher = { ...pub };
    this.isEditing = true;
    this.showForm = true;
    this.clearMessages();
  }

  cancelForm() {
    this.showForm = false;
    this.clearMessages();
  }

  savePublisher() {
    if (this.isEditing) {
      this.http.put(this.baseUrl + 'api/Publishers/' + this.currentPublisher.pubId, this.currentPublisher).subscribe({
        next: () => {
          this.showSuccess('Publisher updated successfully.');
          this.showForm = false;
          this.loadPublishers();
        },
        error: (err) => { this.showError('Failed to update publisher. Please check your data.'); }
      });
    } else {
      this.http.post<Publisher>(this.baseUrl + 'api/Publishers', this.currentPublisher).subscribe({
        next: () => {
          this.showSuccess('New publisher added successfully.');
          this.showForm = false;
          this.loadPublishers();
        },
        error: (err) => { this.showError('Failed to add publisher. ID might already exist.'); }
      });
    }
  }

  deletePublisher(id: string) {
    if (confirm('Are you sure you want to delete this publisher?')) {
      this.http.delete(this.baseUrl + 'api/Publishers/' + id).subscribe({
        next: () => {
          this.showSuccess('Publisher deleted successfully.');
          this.loadPublishers();
        },
        error: (err) => { this.showError('Failed to delete publisher. It might be in use by a title.'); }
      });
    }
  }

  getEmptyPublisher(): Publisher {
    return { pubId: '', pubName: '', city: '', state: '', country: '' };
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

interface Publisher {
  pubId: string;
  pubName: string;
  city: string;
  state: string;
  country: string;
}
