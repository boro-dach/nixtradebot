import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AddToBalanceDto, setBalanceDto } from './dto/balance.dto';

@Injectable()
export class BalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getBalance(tgid: string) {
    const user = await this.userService.findById(tgid);

    return user?.balance;
  }

  async addToBalance(dto: AddToBalanceDto) {
    const currentUser = await this.prisma.user.findUnique({
      where: { tgid: dto.tgid },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        tgid: dto.tgid,
      },
      data: {
        balance: currentUser.balance + dto.amount,
      },
    });

    return updatedUser;
  }

  async subtractFromBalance(dto: AddToBalanceDto) {
    const currentUser = await this.prisma.user.findUnique({
      where: { tgid: dto.tgid },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    if (currentUser.balance < dto.amount) {
      throw new Error('Insufficient balance');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        tgid: dto.tgid,
      },
      data: {
        balance: currentUser.balance - dto.amount,
      },
    });

    return updatedUser;
  }

  async setBalance(dto: setBalanceDto) {
    const user = await this.prisma.user.update({
      where: {
        tgid: dto.tgid,
      },
      data: {
        balance: dto.balance,
      },
    });

    return user;
  }
}
