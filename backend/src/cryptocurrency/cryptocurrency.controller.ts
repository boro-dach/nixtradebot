import { Controller } from '@nestjs/common';
import { CryptocurrencyService } from './cryptocurrency.service';

@Controller('cryptocurrency')
export class CryptocurrencyController {
  constructor(private readonly cryptocurrencyService: CryptocurrencyService) {}
}
