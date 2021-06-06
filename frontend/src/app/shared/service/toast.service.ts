import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];

  showTemplate(template: TemplateRef<any>, context: any, options: any = {}) {
    const size = this.toasts.push({ template, context, ...options });
    return this.toasts[size - 1];
  }

  showText(text: string, options: any = {}) {
    const size = this.toasts.push({ text, ...options });
    return this.toasts[size - 1];
  }

  showProgress(options: any = {}) {
    const size = this.toasts.push({ ...options });
    return this.toasts[size - 1];
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  removeAll() {
    this.toasts = [];
  }
}