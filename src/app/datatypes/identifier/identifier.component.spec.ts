import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierComponent } from './identifier.component';

describe('IdentifierComponent', () => {
  let component: IdentifierComponent;
  let fixture: ComponentFixture<IdentifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentifierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdentifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
