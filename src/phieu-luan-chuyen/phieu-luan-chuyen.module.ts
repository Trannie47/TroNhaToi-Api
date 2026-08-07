import { Module } from '@nestjs/common';
import { PhieuLuanChuyenController } from './controllers/phieu-luan-chuyen.controller';
import { PhieuLuanChuyenService } from './services/phieu-luan-chuyen.service';
import { ThongKeModule } from 'src/thong-ke/thong-ke.module';

@Module({
  imports: [ThongKeModule],
  controllers: [PhieuLuanChuyenController],
  providers: [PhieuLuanChuyenService],
})
export class PhieuLuanChuyenModule {}