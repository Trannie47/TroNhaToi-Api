import { PartialType } from '@nestjs/swagger';
import { CreateChiTietLuanChuyenDto } from './create-phieu-luan-chuyen.dto';

export class UpdateChiTietLuanChuyenDto extends PartialType(CreateChiTietLuanChuyenDto) {}