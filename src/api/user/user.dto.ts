import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  public id: number;

  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
