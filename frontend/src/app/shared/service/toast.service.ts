import { Injectable, TemplateRef } from '@angular/core';
import { NGXLogger } from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];

  constructor(
    private logger: NGXLogger) {
  }

  showTemplate(template: TemplateRef<any>, context: any, options: any = {}) {
    const size = this.toasts.push({ template, context, ...options });
    this.logger.debug("show toast", size);

    return this.toasts[size - 1];
  }

  showText(text: string, options: any = {}) {
    const size = this.toasts.push({ text, ...options });
    this.logger.debug("show toast", size);

    return this.toasts[size - 1];
  }

  showProgress(options: any = {}) {
    const size = this.toasts.push({ ...options });
    this.logger.debug("show toast", size);

    return this.toasts[size - 1];
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  removeAll() {
    this.toasts = [];
  }
}