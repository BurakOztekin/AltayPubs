import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-titleauthors',
  templateUrl: './titleauthors.component.html'
})
export class TitleauthorsComponent implements OnInit {
  public titleAuthors: TitleAuthor[] = [];
  public currentRelation: TitleAuthor = this.getEmptyRelation();
  public isEditing: boolean = false;
  public showForm: boolean = false;

  public errorMessage: string = '';
  public successMessage: string = '';

  private baseUrl: string;

  constructor(private http: HttpClient, public authService: AuthService, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  ngOnInit() {
    this.loadTitleAuthors();
  }

  loadTitleAuthors() {
    this.http.get<TitleAuthor[]>(this.baseUrl + 'api/TitleAuthors').subscribe({
      next: (result) => { this.titleAuthors = result; },
      error: (err) => { this.showError('Failed to load title-authors from the server.'); }
    });
  }

  openNewForm() {
    this.currentRelation = this.getEmptyRelation();
    this.isEditing = false;
    this.showForm = true;
    this.clearMessages();
  }

  editRelation(ta: TitleAuthor) {
    this.currentRelation = { ...ta };
    this.isEditing = true;
    this.showForm = true;
    this.clearMessages();
  }

  cancelForm() {
    this.showForm = false;
    this.clearMessages();
  }

  saveRelation() {
    // Frontend Doğrulaması. Hatalıysa API ye gitmeden durdur
    if (this.currentRelation.royaltyper < 1 || this.currentRelation.royaltyper > 100 || this.currentRelation.auOrd < 1) {
      this.showError("Please enter valid data: Author Order must be >= 1 and Royalty Percentage must be 1-100.");
      window.scrollTo(0, 0);
      return;
    }

    // Eğer sayı integer ise 1 e bölümünden kalan 0. Eğer sayı double ise 1 e bölümünden kalan 0 dan farklı bir değer. 
    if (this.currentRelation.royaltyper % 1 !== 0 || this.currentRelation.auOrd % 1 !== 0) {
      this.showError("Please enter integer numbers only. Decimal values are not allowed.");
      window.scrollTo(0, 0);
      return;
    }

    if (this.isEditing) {
      this.http.put(`${this.baseUrl}api/TitleAuthors/${this.currentRelation.auId}/${this.currentRelation.titleId}`, this.currentRelation).subscribe({
        next: () => {
          this.showSuccess('Relation updated successfully.');
          this.showForm = false;
          this.loadTitleAuthors();
        },
        error: (err) => {
          // C# tan gelen spesifik hata mesajlarını ayıklama ve gösterme
          if (err.error && err.error.errors) {
            this.showError((Object.values(err.error.errors).reduce((acc: any, val: any) => acc.concat(val), []) as string[]).join(' '));
          } else if (typeof err.error === 'string') {
            this.showError(err.error);
          } else {
            this.showError('Failed to update. Please check your data.');
          }
          window.scrollTo(0, 0);
        }
      });
    } else {
      this.http.post<TitleAuthor>(this.baseUrl + 'api/TitleAuthors', this.currentRelation).subscribe({
        next: () => {
          this.showSuccess('New relation added successfully.');
          this.showForm = false;
          this.loadTitleAuthors();
        },
        error: (err) => {
          // C# tan gelen spesifik hata mesajlarını ayıklama ve gösterme
          if (err.error && err.error.errors) {
            this.showError((Object.values(err.error.errors).reduce((acc: any, val: any) => acc.concat(val), []) as string[]).join(' '));
          } else if (typeof err.error === 'string') {
            this.showError(err.error);
          } else {
            this.showError('Failed to add. Make sure both Author ID and Title ID exist.');
          }
          window.scrollTo(0, 0);
        }
      });
    }
  }

  deleteRelation(auId: string, titleId: string) {
    if (confirm('Are you sure you want to delete this relation?')) {
      this.http.delete(`${this.baseUrl}api/TitleAuthors/${auId}/${titleId}`).subscribe({
        next: () => {
          this.showSuccess('Relation deleted successfully.');
          this.loadTitleAuthors();
        },
        error: (err) => { this.showError('Failed to delete relation.'); }
      });
    }
  }

  getEmptyRelation(): TitleAuthor {
    return { auId: '', titleId: '', auOrd: null, royaltyper: null };
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

interface TitleAuthor {
  auId: string;
  titleId: string;
  auOrd: number | null;
  royaltyper: number | null;
}
