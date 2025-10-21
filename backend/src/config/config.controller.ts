// config.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ConfigService } from './config.service';

// Предполагаем, что у вас есть guard для проверки прав администратора
// @UseGuards(AdminGuard)
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('vat')
  async getVatPercentage() {
    const vatPercentage = await this.configService.getVatPercentage();
    return {
      success: true,
      vatPercentage,
    };
  }

  @Put('vat')
  async setVatPercentage(@Body() body: { vatPercentage: number }) {
    if (
      typeof body.vatPercentage !== 'number' ||
      body.vatPercentage < 0 ||
      body.vatPercentage > 100
    ) {
      return {
        success: false,
        message: 'VAT percentage must be a number between 0 and 100',
      };
    }

    await this.configService.setVatPercentage(body.vatPercentage);
    return {
      success: true,
      vatPercentage: body.vatPercentage,
      message: `VAT percentage updated to ${body.vatPercentage}%`,
    };
  }

  @Get('min-deposit')
  async getMinDeposit() {
    const minDeposit = await this.configService.getMinDeposit();
    return {
      success: true,
      minDeposit,
    };
  }

  @Put('min-deposit')
  async setMinDeposit(@Body() body: { minDeposit: number }) {
    if (typeof body.minDeposit !== 'number' || body.minDeposit < 0) {
      return {
        success: false,
        message: 'Minimum deposit must be a positive number',
      };
    }

    await this.configService.setMinDeposit(body.minDeposit);
    return {
      success: true,
      minDeposit: body.minDeposit,
      message: `Minimum deposit updated to $${body.minDeposit}`,
    };
  }

  @Get('all')
  async getAllConfig() {
    const [vatPercentage, minDeposit] = await Promise.all([
      this.configService.getVatPercentage(),
      this.configService.getMinDeposit(),
    ]);

    return {
      success: true,
      config: {
        vatPercentage,
        minDeposit,
      },
    };
  }
}
