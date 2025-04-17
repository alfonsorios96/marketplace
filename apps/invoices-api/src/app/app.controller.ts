import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async healthCheck() {
    const dbReady = this.appService.isDbConnected();
    return {
      status: dbReady ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
    };
  }
}
