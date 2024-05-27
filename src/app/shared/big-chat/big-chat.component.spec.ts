import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigChatComponent } from './big-chat.component';

describe('BigChatComponent', () => {
  let component: BigChatComponent;
  let fixture: ComponentFixture<BigChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BigChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BigChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
