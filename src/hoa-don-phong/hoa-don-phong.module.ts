import { Module } from '@nestjs/common';
import { HoaDonPhongService } from './services/hoa-don-phong.service';
import { HoaDonPhongController } from './controllers/hoa-don-phong.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ThongKeModule } from '../thong-ke/thong-ke.module';
import { HoaDonDienNuocModule } from '../hoa-don-dien-nuoc/hoa-don-dien-nuoc.module';

@Module({
  imports: [
      CloudinaryModule,ThongKeModule, HoaDonDienNuocModule
    ],
  controllers: [HoaDonPhongController],
  providers: [HoaDonPhongService],
  exports: [HoaDonPhongService],
})
export class HoaDonPhongModule {}
