import { IsString, IsOptional, IsInt, Min, Max, IsNotEmpty, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  isbn?: string;

  @IsNotEmpty({ message: 'Judul buku wajib diisi' })
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty({ message: 'Penulis buku wajib diisi' })
  @IsString()
  @MaxLength(255)
  author: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  publisher?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  @Type(() => Number)
  publication_year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  cover_url?: string;
}
