import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  /**
   * El nombre de la categoria (puede contener maximo 50 caracteres, letras minúsculas, letras mayúsculas y - )
   * @example "hard-disk"
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z-]+$/)
  name: string;
}

export class UpdateCategoryDto {
  /**
   * El nombre de la categoria (puede contener maximo 50 caracteres, letras minúsculas, letras mayúsculas y - )
   * @example "printer"
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z-]+$/)
  name: string;
}
