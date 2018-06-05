import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckSideNavComponent } from './deck-side-nav.component';

describe('DeckSideNavComponent', () => {
  let component: DeckSideNavComponent;
  let fixture: ComponentFixture<DeckSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
