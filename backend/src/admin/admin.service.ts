import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getByLogin(login: string) {
    const admin = await this.prisma.admin.findFirst({
      where: { login },
    });

    return admin;
  }
}
