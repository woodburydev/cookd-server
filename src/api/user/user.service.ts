import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  public getUser(fbuuid: string): Promise<User> {
    return this.repository.findOneBy({ fbuuid: fbuuid });
  }

  public getUsers(): Promise<User[]> {
    return this.repository.find();
  }

  public createUser(body: CreateUserDto): Promise<{ status: string }> {
    const user: User = new User();

    user.email = body.email;
    user.phone = body.phone;
    user.firstname = body.firstname;
    user.lastname = body.lastname;
    user.countrycode = body.countrycode;
    user.fbuuid = body.fbuuid;
    user.allergies = body.allergies;
    return this.repository
      .save(user)
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
