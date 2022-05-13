import { Optional } from '@nestjs/common';
import { IsArray, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCookDto {
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
  public foundOut: string[];
  
  @IsString()
  @IsNotEmpty()
  public address: string;
}

export class CanCreateCook {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
