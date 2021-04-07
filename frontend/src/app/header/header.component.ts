import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output('onLinkClick') onLink: EventEmitter<string> = new EventEmitter();
  title = "Simple Auto Club"
  collapsed = false;

  onLinkClick(e: Event, action: string) {
    e.preventDefault();
    this.onLink.emit(action);
  }
}
