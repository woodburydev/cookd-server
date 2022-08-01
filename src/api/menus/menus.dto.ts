import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateMenu {
  public id!: string;

  @IsString()
  @IsNotEmpty()
  public fbuuid: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  public costPerPerson: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @Type(() => Appetizer)
  @IsOptional()
  public appetizers: Appetizer[];

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @Type(() => Appetizer)
  @IsOptional()
  public entrees: Appetizer[];

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @Type(() => Appetizer)
  @IsOptional()
  public deserts: Appetizer[];

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @Type(() => Extras)
  @IsOptional()
  public extras: Extras[];
}

export class UpdateMenu {
  @IsString()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  public costPerPerson: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @Transform(({ value }) => JSON.parse(value))
  @Type(() => Appetizer)
  @IsArray()
  @IsOptional()
  public appetizers: Appetizer[];

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @Type(() => Appetizer)
  @IsOptional()
  public entrees: Appetizer[];

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @Type(() => Appetizer)
  @IsOptional()
  public deserts: Appetizer[];

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @Type(() => Extras)
  @IsOptional()
  public extras: Extras[];
}

export class Appetizer {
  @IsString()
  public title: string;

  @IsString()
  @IsOptional()
  public description: string;
}

export class Extras {
  @IsString()
  public title: string;

  @IsString()
  @IsOptional()
  public description: string;

  @IsInt()
  public cost: number;
}
