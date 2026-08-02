import { Module } from '@nestjs/common';
import { ChiTietLuanChuyenController } from './controllers/chi-tiet-luan-chuyen.controller';
import { ChiTietLuanChuyenService } from './services/chi-tiet-luan-chuyen.service';
import { ThongKeModule } from 'src/thong-ke/thong-ke.module';

@Module({
  imports: [ThongKeModule],
  controllers: [ChiTietLuanChuyenController],
  providers: [ChiTietLuanChuyenService],
})
export class ChiTietLuanChuyenModule {}