import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { TransactionModule } from './transaction/transaction.module';
import { BalanceModule } from './balance/balance.module';

@Module({
  imports: [AuthModule, UserModule, AdminModule, TransactionModule, BalanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
