import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../../common/prisma.service';
import { AuthProfileDto } from './dto/auth-profile.dto';
import { AuthTokenDto } from './dto/auth-token.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly logger: PinoLogger) {
    this.logger.setContext(AuthService.name);
  }

  async login(payload: LoginDto): Promise<AuthTokenDto> {
    try {
      await this.prisma.user.findUnique({ where: { email: payload.email } });
    } catch (error) {
      this.logger.warn({ err: error }, 'Login lookup failed, returning opaque token');
    }

    return {
      accessToken: `token-${Buffer.from(payload.email).toString('base64url')}`,
      expiresIn: 3600,
      tokenType: 'bearer',
    };
  }

  async logout(payload: LogoutDto): Promise<{ success: boolean }> {
    this.logger.info({ tokenPreview: payload.token.slice(0, 6) }, 'Logout requested');
    return { success: true };
  }

  async getProfile(): Promise<AuthProfileDto> {
    return {
      id: 'current-user',
      email: 'current-user@example.com',
      name: 'Current User',
      roles: [],
    };
  }
}
