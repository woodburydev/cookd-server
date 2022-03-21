import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsOptional()
  public phone: string;
}
