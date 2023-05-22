import {
  SharedBullConfigurationFactory,
  BullModuleOptions,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) {}

  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: this.configService.get<string>('REDIS_URL') || '',
    };
  }
}
