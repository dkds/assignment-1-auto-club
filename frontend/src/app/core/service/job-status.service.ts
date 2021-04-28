import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { fromEvent, merge, Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobStatusService {

  constructor() {
  }

  connect(jobId: string, type: string): Observable<any> {
    const socket = io(`${environment.apiHost}/job-status/${type}`, { transports: ['websocket'], timeout: 60000 });

    socket.once('connect', () => {
      console.log('progress-listener connected', jobId);
      socket.emit("progress-listener-ready", { jobId });
    });
    socket.once('disconnect', () => {
      console.log('progress-listener disconnected', jobId);
    });
    return fromEvent(socket, 'job-progress').pipe(takeUntil(fromEvent(socket, "job-finished")));
  }
}
