import { IsInt, IsPositive } from 'class-validator';

export class CreateLoanDto {
  @IsInt({ message: 'book_item_id harus berupa angka' })
  @IsPositive({ message: 'book_item_id harus lebih besar dari 0' })
  book_item_id: number;
}
