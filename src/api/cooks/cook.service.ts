import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCookDto } from './cook.dto';
import { Cook } from './cook.entity';

@Injectable()
export class CookService {
  @InjectRepository(Cook)
  private readonly repository: Repository<Cook>;

  public getCook(fbuuid: string): Promise<Cook> {
    return this.repository.findOneBy({ fbuuid: fbuuid });
  }

  public getCooks(): Promise<Cook[]> {
    return this.repository.find();
  }

  public createCook(body: CreateCookDto): Promise<{ status: string }> {
    const cook: Cook = new Cook();

    cook.email = body.email;
    cook.phone = body.phone;
    cook.firstname = body.firstname;
    cook.lastname = body.lastname;
    cook.countrycode = body.countrycode;
    cook.fbuuid = body.fbuuid;
    return this.repository
      .save(cook)
      .then(() => {
        return {
          status: 'success',
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          status: 'error',
        };
      });
  }
}
