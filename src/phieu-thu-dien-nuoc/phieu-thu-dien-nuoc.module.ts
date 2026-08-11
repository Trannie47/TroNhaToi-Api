import { Module } from '@nestjs/common';
import { PhieuThuDienNuocService } from './services/phieu-thu-dien-nuoc.service';
import { PhieuThuDienNuocController } from './controllers/phieu-thu-dien-nuoc.controller';
import { HoaDonDienNuocModule } from '../hoa-don-dien-nuoc/hoa-don-dien-nuoc.module';
import { ThongKeModule } from '../thong-ke/thong-ke.module';

@Module({
  imports: [HoaDonDienNuocModule, ThongKeModule],
  controllers: [PhieuThuDienNuocController],
  providers: [PhieuThuDienNuocService],
  exports: [PhieuThuDienNuocService],
})
export class PhieuThuDienNuocModule {}