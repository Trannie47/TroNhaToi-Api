import { Module } from '@nestjs/common';
import { NguoiOGhepService } from './services/nguoi-o-ghep.service';
import { NguoiOGhepController } from './controllers/nguoi-o-ghep.controller';

@Module({
  controllers: [NguoiOGhepController],
  providers: [NguoiOGhepService],
  exports: [NguoiOGhepService],
})
export class NguoiOGhepModule {}
