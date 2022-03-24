import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  public id!: number;

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
  public countrycode: string;

  @IsString()
  @IsNotEmpty()
  public fbuuid: string;

  @IsString()
  public allergies: string;
}
