import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() { }

  onHeaderLinkClick(action: string) {
    console.log('sideBarOpen', action);
  }
}
