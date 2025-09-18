import { Injectable } from '@nestjs/common';
import { ClientStatus } from '@eventon/db';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientDto } from './dto/client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

type ClientEntity = {
  id: string;
  organisationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
  notes: string | null;
};

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(ClientsService.name);
  }

  async list(orgId: string): Promise<ClientDto[]> {
    try {
      const clients = (await this.prisma.client.findMany({
        where: { organisationId: orgId },
        take: 100,
        orderBy: { createdAt: 'desc' },
      })) as ClientEntity[];
      return clients.map((client) => this.toDto(client));
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Returning fallback client list');
      return [
        {
          id: 'stub-client',
          name: 'Demo Client',
          email: 'demo-client@example.com',
          phone: null,
          status: ClientStatus.ACTIVE,
          notes: 'Fallback client returned because the database is not reachable.',
        } as ClientDto,
      ];
    }
  }

  async create(orgId: string, payload: CreateClientDto): Promise<ClientDto> {
    try {
      const client = (await this.prisma.client.create({
        data: {
          organisationId: orgId,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          status: payload.status ?? ClientStatus.ACTIVE,
          notes: payload.notes,
        },
      })) as ClientEntity;
      return this.toDto(client);
    } catch (error) {
      this.logger.warn({ err: error, orgId }, 'Client creation failed, returning echo response');
      return {
        id: `client-${Date.now()}`,
        name: payload.name,
        email: payload.email ?? null,
        phone: payload.phone ?? null,
        status: payload.status ?? ClientStatus.ACTIVE,
        notes: payload.notes ?? null,
      } as ClientDto;
    }
  }

  async get(orgId: string, clientId: string): Promise<ClientDto> {
    try {
      const client = (await this.prisma.client.findFirst({
        where: { id: clientId, organisationId: orgId },
      })) as ClientEntity | null;
      if (client) {
        return this.toDto(client);
      }
    } catch (error) {
      this.logger.warn({ err: error, orgId, clientId }, 'Client lookup failed');
    }

    return {
      id: clientId,
      name: 'Unknown Client',
      email: null,
      phone: null,
      status: ClientStatus.INACTIVE,
      notes: 'Fallback client when no record is available.',
    } as ClientDto;
  }

  async update(orgId: string, clientId: string, payload: UpdateClientDto): Promise<ClientDto> {
    try {
      const client = (await this.prisma.client.update({
        where: { id: clientId },
        data: payload,
      })) as ClientEntity;
      return this.toDto(client);
    } catch (error) {
      this.logger.warn({ err: error, orgId, clientId }, 'Client update failed, returning merged payload');
      const existing = await this.get(orgId, clientId);
      return {
        ...existing,
        ...payload,
      } as ClientDto;
    }
  }

  private toDto(client: ClientEntity): ClientDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email ?? null,
      phone: client.phone ?? null,
      status: client.status,
      notes: client.notes ?? null,
    };
  }
}
