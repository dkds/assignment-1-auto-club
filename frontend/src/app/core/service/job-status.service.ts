import { Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import io from 'socket.io-client';
import { from, fromEvent, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { exportListRequestCompleted, importListRequestCompleted } from '../state/member/member.actions';
import { create } from 'socketcluster-client';

@Injectable({
  providedIn: 'root'
})
export class JobStatusService {

  socket;

  constructor(
    private logger: NGXLogger,
    private store: Store) {
    this.socket = create({
      hostname: 'localhost',
      port: 8000,
    });
    this.logger.debug('job-listener connected');
  }

  connect(jobId: string, type: string): Observable<any> {
    const channelProgress = this.socket.subscribe(`job-progress/${type}/${jobId}`);
    const channelFinish = this.socket.subscribe(`job-finished/${type}/${jobId}`);
    const progress = new Observable((observer) => {
      (async () => {
        for await (let data of channelProgress) {
          observer.next(data);
        }
      })();
      (async () => {
        for await (let { } of channelFinish) {
          observer.complete();
          if (type == 'import') {
            this.store.dispatch(importListRequestCompleted({ jobId }));
          }
          if (type == 'export') {
            this.store.dispatch(exportListRequestCompleted({ jobId }));
          }
          this.logger.debug('job-listener completed', jobId);
          break;
        }
      })();
    });
    return progress;
  }
}
