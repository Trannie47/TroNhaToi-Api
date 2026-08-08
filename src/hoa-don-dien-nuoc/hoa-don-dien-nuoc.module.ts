import { Module } from '@nestjs/common';
import { HoaDonDienNuocService } from './services/hoa-don-dien-nuoc.service';

@Module({
  providers: [HoaDonDienNuocService],
  exports: [HoaDonDienNuocService],
})
export class HoaDonDienNuocModule {}
