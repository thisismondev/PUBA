import { IsOptional, IsString, IsInt, Min, Max, IsUrl } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear() + 1)
  publication_year?: number;

  @IsOptional()
  @IsString()
  cover_url?: string;
}
