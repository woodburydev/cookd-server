import { IsArray, IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUserDto {
  public id!: number;

  @IsNotEmpty()
  public displayname: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public phone: string;

  @IsString()
  @IsNotEmpty()
  public fbuuid: string;

  @IsArray()
  public allergies: string[];

  @IsArray()
  public cuisines: string[];
}

export class CanCreateUser {
  @IsNotEmpty()
  @IsString()
  public firstname: string;

  @IsNotEmpty()
  @IsString()
  public lastname: string;

  @IsNotEmpty()
  @IsString()
  // validate phone somehow
  public phone: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
