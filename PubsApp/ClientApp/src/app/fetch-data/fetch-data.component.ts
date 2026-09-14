import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public authors: Author[] = [];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    http.get<Author[]>(baseUrl + 'api/authors').subscribe(result => {
      this.authors = result;
    }, error => console.error(error));
  }
}


interface Author {
  auId: string;
  auFname: string;
  auLname: string;
  phone: string;
  city: string;
}
