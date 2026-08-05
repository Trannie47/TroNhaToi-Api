import { Module } from '@nestjs/common';
import { CauHinhGiaXeController } from './controllers/cau-hinh-gia-xe.controller';
import { CauHinhGiaXeService } from './services/cau-hinh-gia-xe.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CauHinhGiaXeController],
  providers: [CauHinhGiaXeService],
})
export class CauHinhGiaXeModule {}
