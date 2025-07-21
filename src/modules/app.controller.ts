import { HttpService } from '@nestjs/axios';
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@ApiTags('App')
@Controller('health')
export class AppController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('user')
  async userHealthCheck(): Promise<string> {
    const baseUrl = this.configService.get<string>('USER_SERVICE_URL');

    if (baseUrl === undefined || baseUrl === '') {
      throw new InternalServerErrorException(
        'USER_SERVICE_URL is not defined or empty',
      );
    }

    const url = `${baseUrl}/health`;

    const response: AxiosResponse<unknown> = await firstValueFrom(
      this.httpService.get(url),
    );

    if (typeof response.data !== 'string') {
      throw new InternalServerErrorException(
        'Unexpected response format from user service',
      );
    }

    return response.data;
  }
  @Get('product')
  async productHealthCheck(): Promise<string> {
    const baseUrl = this.configService.get<string>('PRODUCT_SERVICE_URL');

    if (baseUrl === undefined || baseUrl === '') {
      throw new InternalServerErrorException(
        'PRODUCT_SERVICE_URL is not defined or empty',
      );
    }

    const url = `${baseUrl}/health`;

    const response: AxiosResponse<unknown> = await firstValueFrom(
      this.httpService.get(url),
    );

    if (typeof response.data !== 'string') {
      throw new InternalServerErrorException(
        'Unexpected response format from product service',
      );
    }

    return response.data;
  }
}
