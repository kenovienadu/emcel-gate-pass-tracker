import { GuestArrivalMode } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class GeneratePassDTO {
  @IsBoolean()
  @IsOptional()
  allowMultipleUses?: boolean;

  @IsString()
  guestName: string;

  @IsEnum(GuestArrivalMode)
  arrivalMode: GuestArrivalMode;
}
