import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cookdChefAdminSDK } from 'src/main';
import { Repository } from 'typeorm';
import { CanCreateCook, CreateCookDto } from './cook.dto';
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
    cook.displayname = body.displayname;
    cook.fbuuid = body.fbuuid;
    cook.foundOut = body.foundOut;
    cook.address = body.address;
    // cook.foundOut = body.foundOut;

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

  public canCreateCook(body: CanCreateCook): Promise<{ status: boolean; reason: string }> {
    return cookdChefAdminSDK
      .auth()
      .getUserByEmail(body.email)
      .then(async (user) => {
        const { uid } = user;
        const dbUser = await this.repository.findOneBy({ fbuuid: uid });
        if (!dbUser) {
          return {
            status: false,
            reason: 'not-in-db',
          };
        }
        return {
          status: false,
          reason: 'invalid-email',
        };
      })
      .catch(() => {
        return {
          status: true,
          reason: '',
        };
      });
  }
}
