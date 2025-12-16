import { IsEnum, IsNotEmpty } from 'class-validator';
import { ItemStatus } from '@prisma/client';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'Status wajib diisi' })
  @IsEnum(ItemStatus, { 
    message: 'Status harus salah satu dari: available, borrowed, lost, atau repair' 
  })
  status: ItemStatus;
}
