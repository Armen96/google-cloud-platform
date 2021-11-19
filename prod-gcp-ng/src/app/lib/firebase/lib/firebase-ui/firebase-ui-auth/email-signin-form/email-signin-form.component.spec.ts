import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSigninFormComponent } from './email-signin-form.component';

describe('EmailSigninFormComponent', () => {
  let component: EmailSigninFormComponent;
  let fixture: ComponentFixture<EmailSigninFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSigninFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSigninFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
