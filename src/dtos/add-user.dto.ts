import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class AddUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
