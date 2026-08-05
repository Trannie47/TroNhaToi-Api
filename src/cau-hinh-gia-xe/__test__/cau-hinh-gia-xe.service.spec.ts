import { Test, TestingModule } from '@nestjs/testing';
import { CauHinhGiaXeService } from '../services/cau-hinh-gia-xe.service';
import { before, describe, it } from 'node:test';
describe('CauHinhGiaXeService', () => {
  let service: CauHinhGiaXeService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CauHinhGiaXeService],
    }).compile();

    service = module.get<CauHinhGiaXeService>(CauHinhGiaXeService);
  });


});
