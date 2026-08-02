import { PartialType } from '@nestjs/swagger';
import { CreateChiTietLuanChuyenDto } from './create-chi-tiet-luan-chuyen.dto';

export class UpdateChiTietLuanChuyenDto extends PartialType(CreateChiTietLuanChuyenDto) {}