import { Component } from '@angular/core';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toast-container.component.html',
  host: { '[class.ngb-toasts]': 'true' }
})
export class ToastsContainer {

  constructor(public toastService: ToastService) { }
}