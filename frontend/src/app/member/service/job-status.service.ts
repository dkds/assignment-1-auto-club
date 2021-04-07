import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobStatusService {

  constructor() {
  }

  connect(jobId: string): Observable<any> {
    const socket = io("http://localhost:3000/job-status", { transports: ['websocket'], timeout: 60000 });

    socket.once('connect', () => {
      console.log('progress-listener connected', jobId);
      socket.emit("progress-listener-ready", { jobId });
    });
    socket.once('disconnect', () => {
      console.log('progress-listener disconnected', jobId);
    });
    return fromEvent(socket, 'job-progress')
      .pipe(takeUntil(fromEvent(socket, "job-finished")));
  }
}
