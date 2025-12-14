import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemStatus } from '@prisma/client';

export class CreateBookItemDto {
  @IsNotEmpty({ message: 'book_id wajib diisi' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  book_id: number;

  @IsNotEmpty({ message: 'Kode inventaris wajib diisi' })
  @IsString()
  @MaxLength(100)
  inventory_code: string;

  @IsOptional()
  @IsEnum(ItemStatus, { message: 'Status harus: available, borrowed, lost, atau repair' })
  status?: ItemStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  rack_location?: string;
}
