import { Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MemberActions } from '../state/member/member.actions';
import { create } from 'socketcluster-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobStatusService {

  constructor(
    private logger: NGXLogger,
    private store: Store) {
  }

  connect(jobId: string, type: string): Observable<any> {
    const socket = create(environment.socketcluster);
    this.logger.debug('job-listener connected');
    const channelProgress = socket.subscribe(`job-progress/${type}/${jobId}`);
    const channelFinish = socket.subscribe(`job-finished/${type}/${jobId}`);
    const progress = new Observable((observer) => {
      (async () => {
        for await (let data of channelProgress) {
          this.logger.debug('job-listener progress update', data);
          observer.next(data);
        }
      })();
      (async () => {
        for await (let { } of channelFinish) {
          this.logger.debug('job-listener completed');
          observer.complete();
          if (type == 'import') {
            this.store.dispatch(MemberActions.importListRequestCompleted({ jobId }));
          }
          if (type == 'export') {
            this.store.dispatch(MemberActions.exportListRequestCompleted({ jobId }));
          }
          this.logger.debug('job-listener completed', jobId);
          socket.disconnect();
          break;
        }
      })();
    });
    if (type == 'import') {
      this.store.dispatch(MemberActions.importListRequestListenerStarted({ jobId }));
    }
    if (type == 'export') {
      this.store.dispatch(MemberActions.exportListRequestListenerStarted({ jobId }));
    }
    return progress;
  }
}
