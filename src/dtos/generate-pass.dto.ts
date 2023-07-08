import { IsBoolean, IsOptional } from 'class-validator';

export class GeneratePassDTO {
  @IsBoolean()
  @IsOptional()
  allowMultipleUses?: boolean;
}
