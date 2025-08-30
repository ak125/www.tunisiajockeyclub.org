import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { 
  cors: { origin: '*' },
  namespace: 'races'
})
export class RaceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private activeRaces = new Map<string, any>();
  private connectedUsers = new Map<string, Socket>();

  handleConnection(client: Socket) {
    this.connectedUsers.set(client.id, client);
    console.log(`🔌 Client connecté: ${client.id}`);
    
    // Envoyer l'état initial
    client.emit('initialState', {
      races: Array.from(this.activeRaces.values()),
      connectedUsers: this.connectedUsers.size
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`🔌 Client déconnecté: ${client.id}`);
    
    // Notifier les autres utilisateurs
    this.server.emit('userCountUpdate', {
      connectedUsers: this.connectedUsers.size
    });
  }

  @SubscribeMessage('joinRace')
  handleJoinRace(client: Socket, raceId: string) {
    client.join(`race-${raceId}`);
    
    const raceData = this.activeRaces.get(raceId);
    if (raceData) {
      client.emit('raceData', raceData);
    }
    
    // Notification aux autres dans la room
    client.to(`race-${raceId}`).emit('userJoined', {
      userId: client.id,
      timestamp: new Date()
    });
  }

  @SubscribeMessage('raceUpdate')
  handleRaceUpdate(client: Socket, data: any) {
    const { raceId, ...updateData } = data;
    
    // Mettre à jour les données de la course
    this.activeRaces.set(raceId, {
      ...this.activeRaces.get(raceId),
      ...updateData,
      timestamp: new Date()
    });
    
    // Diffuser aux clients connectés à cette course
    this.server.to(`race-${raceId}`).emit('liveRaceUpdate', {
      raceId,
      ...updateData,
      timestamp: new Date()
    });
  }
}
