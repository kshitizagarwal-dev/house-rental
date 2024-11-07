import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraetepostComponent } from './craetepost.component';

describe('CraetepostComponent', () => {
  let component: CraetepostComponent;
  let fixture: ComponentFixture<CraetepostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraetepostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraetepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
