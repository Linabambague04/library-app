import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBook } from './index-book';

describe('IndexBook', () => {
  let component: IndexBook;
  let fixture: ComponentFixture<IndexBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexBook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
