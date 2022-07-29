import { Optional } from '@nestjs/common';
import { IsArray, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
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

  @IsArray()
  public foundOut: string[];
}

export class CanCreateUser {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}

export class UpdateUser {
  @IsString()
  @IsOptional()
  public displayname: string;

  @IsString()
  @IsOptional()
  public phone: string;

  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  public fbuuid: string;

  @IsArray()
  @IsOptional()
  public allergies: string[];

  @IsArray()
  @IsOptional()
  public cuisines: string[];
}

export class GetProfilePicture {
  // this is only used for a private function, not for the API. Please remove later.
  @IsOptional()
  fileName?: string;

  @IsString()
  user: string;
}

export class UploadProfilePicture {
  @IsString()
  public fbuuid: string;
}
