import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html'
})
export class TitlesComponent implements OnInit {
  public titles: Title[] = [];
  public currentTitle: Title = this.getEmptyTitle();
  public isEditing: boolean = false;
  public showForm: boolean = false;

  public errorMessage: string = '';
  public successMessage: string = '';

  private baseUrl: string;

  constructor(private http: HttpClient, public authService: AuthService, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.loadTitles();
  }

  loadTitles() {
    this.http.get<Title[]>(this.baseUrl + 'api/Titles').subscribe({
      next: (result) => { this.titles = result; },
      error: (err) => { this.showError('Failed to load titles from the server.'); }
    });
  }

  openNewForm() {
    this.currentTitle = this.getEmptyTitle();
    this.isEditing = false;
    this.showForm = true;
    this.clearMessages();
  }

  editTitle(title: Title) {
    this.currentTitle = { ...title };
    this.isEditing = true;
    this.showForm = true;
    this.clearMessages();
  }

  cancelForm() {
    this.showForm = false;
    this.clearMessages();
  }

  saveTitle() {
    if (this.currentTitle.price < 0 || this.currentTitle.ytdSales < 0) {
      this.showError("Price and YTD Sales cannot be negative.");
      window.scrollTo(0, 0);
      return;
    }
    if (this.currentTitle.ytdSales % 1 !== 0) {
      this.showError("YTD Sales must be a whole number.");
      window.scrollTo(0, 0);
      return;
    }
    //Regular Expression kullanarak doğru ID işlemini sağlamak.
    const idRegex = /^[a-zA-Z]{2}\d{4}$/;
    if (!this.isEditing && (!this.currentTitle.titleId || !idRegex.test(this.currentTitle.titleId))) {
      this.showError("Title ID is missing or invalid. It must be 2 letters followed by 4 digits.");
      window.scrollTo(0, 0);
      return;
    }
    if (this.isEditing) {
      this.http.put(this.baseUrl + 'api/Titles/' + this.currentTitle.titleId, this.currentTitle).subscribe({
        next: () => {
          this.showSuccess('Title updated successfully.');
          this.showForm = false;
          this.loadTitles();
        },
        error: (err) => { this.showError('Failed to update title. Please check your data constraints.'); }
      });
    } else {
      this.http.post<Title>(this.baseUrl + 'api/Titles', this.currentTitle).subscribe({
        next: () => {
          this.showSuccess('New title added successfully.');
          this.showForm = false;
          this.loadTitles();
        },
        error: (err) => { this.showError('Failed to add title. ID might already exist or Pub ID is invalid.'); }
      });
    }
  }

  deleteTitle(id: string) {
    if (confirm('Are you sure you want to delete this title?')) {
      this.http.delete(this.baseUrl + 'api/Titles/' + id).subscribe({
        next: () => {
          this.showSuccess('Title deleted successfully.');
          this.loadTitles();
        },
        error: (err) => { this.showError('Failed to delete title. It might be linked to an author.'); }
      });
    }
  }

  getEmptyTitle(): Title {
    return {
      titleId: '',
      title1: '',
      type: 'popular_comp',
      pubId: '',
      price: null,
      advance: null,
      royalty: null,
      ytdSales: null,
      notes: '',
      pubdate: new Date().toISOString()
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

interface Title {
  titleId: string;
  title1: string;
  type: string;
  pubId: string;
  price: number | null;
  advance: number | null;
  royalty: number | null;
  ytdSales: number | null;
  notes: string;
  pubdate: string;
}
