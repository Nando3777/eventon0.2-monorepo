import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { AuthService } from './auth.service';
import { AuthProfileDto } from './dto/auth-profile.dto';
import { AuthTokenDto } from './dto/auth-token.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue an access token for the user.' })
  @ApiOkResponse({ type: AuthTokenDto })
  login(@Body() payload: LoginDto): Promise<AuthTokenDto> {
    return this.authService.login(payload);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Invalidate the provided access token.' })
  @ApiOkResponse({ type: SuccessResponseDto })
  async logout(@Body() payload: LogoutDto): Promise<SuccessResponseDto> {
    const result = await this.authService.logout(payload);
    return { success: result.success };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Retrieve the profile of the authenticated user.' })
  @ApiOkResponse({ type: AuthProfileDto })
  getProfile(): Promise<AuthProfileDto> {
    return this.authService.getProfile();
  }
}
