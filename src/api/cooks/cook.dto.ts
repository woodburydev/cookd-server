import { Optional, UploadedFile } from '@nestjs/common';
import { IsArray, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, isString, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCookDto {
  public id!: number;

  @IsNotEmpty()
  @IsString()
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

export class UpdateCook {
  @IsString()
  @IsOptional()
  public bio: string;

  @IsString()
  @IsOptional()
  public education: string;

  @IsEmail()
  public email: string;
}

export class FetchCookBioData {
  @IsEmail()
  public email: string;
}

export class GetProfilePicture {
  // this is only used for a private function, not for the API. Please remove later.
  @IsOptional()
  fileName?: string;

  @IsString()
  user: string;
}

export class UploadProfilePicture {
  @IsEmail()
  public userEmail: string;
}
