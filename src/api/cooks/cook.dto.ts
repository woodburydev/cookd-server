import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateCookDto {
  @IsOptional()
  public id: number;

  @IsNotEmpty()
  public firstname: string;

  @IsNotEmpty()
  public lastname: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsNumberString()
  public phone: string;

  @IsNotEmpty()
  @IsNotEmpty()
  public countrycode: string;

  @IsString()
  @IsNotEmpty()
  public fbuuid: string;
}
