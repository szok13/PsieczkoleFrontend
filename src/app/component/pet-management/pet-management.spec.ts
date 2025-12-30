import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetManagement } from './pet-management';

describe('PetManagement', () => {
  let component: PetManagement;
  let fixture: ComponentFixture<PetManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
