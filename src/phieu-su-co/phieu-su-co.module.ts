import { Module } from '@nestjs/common';
import { PhieuSuCoController } from './controllers/phieu-su-co.controller';
import { PhieuSuCoService } from './services/phieu-su-co.service';
import { ThongKeModule } from 'src/thong-ke/thong-ke.module';

@Module({
  imports: [ThongKeModule],
  controllers: [PhieuSuCoController],
  providers: [PhieuSuCoService],
})
export class PhieuSuCoModule {}