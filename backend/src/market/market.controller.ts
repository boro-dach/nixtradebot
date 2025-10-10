import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('assets')
  getAssets(
    @Query('per_page') perPage: string = '100',
    @Query('page') page: string = '1',
  ) {
    return this.marketService.getAssets(parseInt(perPage), parseInt(page));
  }

  @Get('assets/:assetId/price')
  getAssetPrice(
    @Param('assetId') assetId: string,
    @Query('userId') userId?: string,
  ) {
    return this.marketService.getAssetPrice(assetId, userId);
  }

  @Get('assets/:assetId/chart')
  getAssetChart(
    @Param('assetId') assetId: string,
    @Query('days') days: string = '7',
    @Query('userId') userId?: string,
  ) {
    return this.marketService.getAssetChart(assetId, days, userId);
  }

  @Get('stablecoins/stats')
  getStablecoinStats() {
    return this.marketService.getStablecoinStats();
  }

  // ===== ADMIN ENDPOINTS - Добавить защиту через Guards! =====

  /**
   * Синхронизировать топ-100 криптовалют с БД
   * POST /market/admin/sync
   */
  // @UseGuards(AdminGuard)
  @Post('admin/sync')
  syncCryptocurrencies() {
    return this.marketService.syncCryptocurrencies();
  }

  /**
   * Получить список криптовалют из БД
   * GET /market/cryptocurrencies?page=1&limit=100
   */
  @Get('cryptocurrencies')
  getCryptocurrenciesFromDB(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
  ) {
    return this.marketService.getCryptocurrenciesFromDB(
      parseInt(page),
      parseInt(limit),
    );
  }

  /**
   * Установить манипуляцию цены (только для админов)
   * POST /market/admin/manipulate
   * Body: { assetId: "bitcoin", multiplier: 1.5 }
   */
  // @UseGuards(AdminGuard)
  @Post('admin/manipulate')
  setPriceManipulation(
    @Body('assetId') assetId: string,
    @Body('multiplier') multiplier: number,
  ) {
    return this.marketService.setPriceManipulation(assetId, multiplier);
  }

  /**
   * Удалить манипуляцию цены
   * DELETE /market/admin/manipulate/:assetId
   */
  // @UseGuards(AdminGuard)
  @Delete('admin/manipulate/:assetId')
  removePriceManipulation(@Param('assetId') assetId: string) {
    return this.marketService.removePriceManipulation(assetId);
  }

  @Get('admin/manipulations')
  getActiveManipulations() {
    return this.marketService.getActiveManipulations();
  }
}
