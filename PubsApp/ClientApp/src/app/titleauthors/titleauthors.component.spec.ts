import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleauthorsComponent } from './titleauthors.component';

describe('TitleauthorsComponent', () => {
  let component: TitleauthorsComponent;
  let fixture: ComponentFixture<TitleauthorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleauthorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleauthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
