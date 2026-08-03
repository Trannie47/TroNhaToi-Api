import { Module } from '@nestjs/common';
import { HopDongNguoiThueService } from './services/hop-dong-nguoi-thue.service';
import { HopDongNguoiThueController } from './controllers/hop-dong-nguoi-thue.controller';

@Module({
  controllers: [HopDongNguoiThueController],
  providers: [HopDongNguoiThueService],
  exports: [HopDongNguoiThueService],
})
export class HopDongNguoiThueModule {}