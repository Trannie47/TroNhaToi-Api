import { PartialType } from '@nestjs/mapped-types';
import { CreatePhieuSuCoDto } from './create-phieu-su-co.dto';

export class UpdatePhieuSuCoDto extends PartialType(CreatePhieuSuCoDto) {}
