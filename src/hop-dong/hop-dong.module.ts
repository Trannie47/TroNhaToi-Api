import { Module } from '@nestjs/common';
import { HopDongService } from './services/hop-dong.service';
import { HopDongController } from './controllers/hop-dong.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ThongKeModule } from '../thong-ke/thong-ke.module';
import { HoaDonDienNuocModule } from '../hoa-don-dien-nuoc/hoa-don-dien-nuoc.module';

@Module({
  imports: [
    CloudinaryModule,
    ThongKeModule,
    HoaDonDienNuocModule,
  ],
  controllers: [HopDongController],
  providers: [HopDongService],
  exports: [HopDongService],
})
export class HopDongModule {}
