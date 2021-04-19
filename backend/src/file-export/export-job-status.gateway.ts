import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: "job-status/export" })
export class ExportJobStatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private clients: { jobId: string, socket: Socket }[] = [];

  constructor() { }

  handleConnection(client: Socket, ..._args: any[]) {
    client.once("progress-listener-ready", (data) => {
      this.clients.push({ jobId: data?.jobId, socket: client });
      console.log("ws connected", this.clients.length);
    });
  }

  handleDisconnect(client: Socket) {
    this.clients.reduce((prev, current, index) => {
      if (current?.socket?.id === client.id)
        prev.push(index);
      return prev;
    }, []).forEach(i => {
      this.clients.splice(i, 1);
    });
    console.log("ws disconnected", this.clients.length);
  }

  afterInit(_server: Server) {
    console.log("ws", 'afterInit', 'export');
  }

  notifyFinish(jobId: string, data?: any) {
    const client = this.notify(jobId, "job-finished", { jobId: jobId, data });
    if (client) {
      client.disconnect();
    }
  }

  notifyProgress(jobId: string, progress: number, data?: any) {
    this.notify(jobId, "job-progress", { jobId: jobId, progress, data });
  }

  private notify(jobId: string, event: string, data: any) {
    const client = this.getClient(jobId);
    console.log("ws", 'notify', jobId, event, data);
    if (client) {
      client.emit(event, data);
    } else {
      console.error("ws", 'notify', "No client found for", jobId);
    }
    return client;
  }

  private getClient(jobId: string) {
    const client = this.clients.find(client => jobId == client.jobId);
    if (client) {
      return client.socket;
    }
  }
}
