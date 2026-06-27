import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCategoryCreateComponent } from './ticket-category-create';

describe('TicketCategoryCreateComponent', () => {
  let component: TicketCategoryCreateComponent;
  let fixture: ComponentFixture<TicketCategoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCategoryCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCategoryCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
