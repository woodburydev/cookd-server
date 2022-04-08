import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cookdAdminSDK } from 'src/main';
import { Repository, UsingJoinColumnOnlyOnOneSideAllowedError } from 'typeorm';
import { CanCreateUser, CreateUserDto } from './user.dto';
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
    user.displayname = body.displayname;
    user.fbuuid = body.fbuuid;
    user.allergies = body.allergies;
    user.cuisines = body.cuisines;

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

  public canCreateUser(body: CanCreateUser): Promise<{ status: boolean; reason: string }> {
    return cookdAdminSDK
      .auth()
      .getUserByPhoneNumber(body.phone)
      .then(async (user) => {
        return cookdAdminSDK
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
          .catch(async () => {
            const { uid, providerData } = user;
            const dbUser = await this.repository.findOneBy({ fbuuid: uid });
            // phone number registered for some reason, but is not inside of database nor finished registering in firebase
            // providerData[1] === Credentials when user has auth'd with email & password.
            if (!dbUser && !providerData[1]) {
              return {
                status: true,
                reason: '',
              };
            } else if (!dbUser && providerData) {
              return {
                status: false,
                reason: 'not-in-db',
              };
            }
            return {
              status: false,
              reason: 'invalid-number',
            };
          });
      })
      .catch(() =>
        cookdAdminSDK
          .auth()
          .getUserByEmail(body.email)
          .then(async () => {
            // email exists and is in firebase, but the phone number related to this email is not.
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
          }),
      );
  }
}
