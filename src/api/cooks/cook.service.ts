import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCookDto } from './cook.dto';
import { Cook } from './cook.entity';

@Injectable()
export class CookService {
  @InjectRepository(Cook)
  private readonly repository: Repository<Cook>;

  public getCook(id: any): Promise<Cook> {
    return this.repository.findOne(id);
  }

  public getCooks(): Promise<Cook[]> {
    return this.repository.find();
  }

  public createCook(body: CreateCookDto): Promise<Cook> {
    const cook: Cook = new Cook();

    cook.email = body.email;
    cook.phone = body.phone;

    return this.repository.save(cook);
  }
}
