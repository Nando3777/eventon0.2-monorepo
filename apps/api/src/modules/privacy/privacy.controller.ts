import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsentDto } from './dto/consent.dto';
import { CreateDsrDto } from './dto/create-dsr.dto';
import { DsrResponseDto } from './dto/dsr-response.dto';
import { FulfilDsrDto } from './dto/fulfil-dsr.dto';
import { PrivacyExportDto, PrivacyExportResponseDto } from './dto/privacy-export.dto';
import { UpsertConsentDto } from './dto/upsert-consent.dto';
import { VerifyDsrDto } from './dto/verify-dsr.dto';
import { PrivacyService } from './privacy.service';

@ApiTags('privacy')
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('consents')
  @ApiOperation({ summary: 'List consent records for a subject.' })
  @ApiOkResponse({ type: ConsentDto, isArray: true })
  listConsents(@Query('subject') subject: string): Promise<ConsentDto[]> {
    return this.privacyService.listConsents(subject);
  }

  @Post('consents')
  @ApiOperation({ summary: 'Upsert a consent record.' })
  @ApiOkResponse({ type: ConsentDto })
  upsertConsent(@Body() payload: UpsertConsentDto): Promise<ConsentDto> {
    return this.privacyService.upsertConsent(payload);
  }

  @Post('dsr')
  @ApiOperation({ summary: 'Create a new data subject rights request.' })
  @ApiOkResponse({ type: DsrResponseDto })
  createDsr(@Body() payload: CreateDsrDto, @Query('orgId') orgId?: string): Promise<DsrResponseDto> {
    return this.privacyService.createDsr(orgId, payload);
  }

  @Post('dsr/verify')
  @ApiOperation({ summary: 'Mark a data subject request as verified.' })
  @ApiOkResponse({ type: DsrResponseDto })
  verifyDsr(@Body() payload: VerifyDsrDto, @Query('orgId') orgId?: string): Promise<DsrResponseDto> {
    return this.privacyService.verifyDsr(orgId, payload);
  }

  @Post('dsr/fulfil')
  @ApiOperation({ summary: 'Fulfil a data subject request.' })
  @ApiOkResponse({ type: DsrResponseDto })
  fulfilDsr(@Body() payload: FulfilDsrDto, @Query('orgId') orgId?: string): Promise<DsrResponseDto> {
    return this.privacyService.fulfilDsr(orgId, payload);
  }

  @Post('export')
  @ApiOperation({ summary: 'Request a subject data export.' })
  @ApiOkResponse({ type: PrivacyExportResponseDto })
  export(@Body() payload: PrivacyExportDto, @Query('orgId') orgId?: string): Promise<PrivacyExportResponseDto> {
    return this.privacyService.requestExport(orgId, payload);
  }
}
