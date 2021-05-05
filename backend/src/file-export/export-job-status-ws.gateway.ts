import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: "job-status/export" })
export class ExportJobStatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ExportJobStatusGateway.name);

  @WebSocketServer() server: Server;
  private clients: { jobId: string, socket: Socket }[] = [];

  constructor() { }

  handleConnection(client: Socket, ..._args: any[]) {
    client.once("progress-listener-ready", (data) => {
      this.clients.push({ jobId: data?.jobId, socket: client });
      this.logger.log(`WS Export connected, total clients: ${this.clients.length}`);
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
    this.logger.log(`WS Export disconnected, total clients: ${this.clients.length}`);
  }

  afterInit(_server: Server) {
    this.logger.log(`WS Export server initialized at /job-status/export`);
  }

  notifyFinish(jobId: string, data?: any) {
    const clients = this.notify(jobId, "job-finished", { jobId: jobId, data });
    if (clients) {
      clients.forEach(client => client.disconnect());
    }
  }

  notifyProgress(jobId: string, progress: number, data?: any) {
    this.notify(jobId, "job-progress", { jobId: jobId, progress, data });
  }

  private notify(jobId: string, event: string, data: any) {
    const clients = this.getClients(jobId);
    if (clients.length) {
      clients.forEach(client => client.emit(event, data));
    } else {
      this.logger.warn(`WS Export notify - No clients found for, ${jobId}`);
    }
    return clients;
  }

  private getClients(jobId: string) {
    const clients = this.clients.filter(client => jobId == client.jobId);
    if (clients.length) {
      return clients.map(c => c.socket);
    }
  }
}
