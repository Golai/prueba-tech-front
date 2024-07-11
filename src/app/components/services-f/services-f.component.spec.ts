import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesFComponent } from './services-f.component';

describe('ServicesFComponent', () => {
  let component: ServicesFComponent;
  let fixture: ComponentFixture<ServicesFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesFComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
