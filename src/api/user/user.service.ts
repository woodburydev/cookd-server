import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as sharp from 'sharp';
import * as fsPromises from 'fs/promises';
import { cookdAdminSDK, cookdBucket } from 'src/main';
import { Repository } from 'typeorm';
import { CanCreateUser, CreateUserDto, GetProfilePicture, UploadProfilePicture } from './user.dto';
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
    user.profilePictureName = '';
    user.displayname = body.displayname;
    user.fbuuid = body.fbuuid;
    user.allergies = body.allergies;
    user.cuisines = body.cuisines;
    user.foundOut = body.foundOut;

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

  public async getProfilePicture(body: GetProfilePicture): Promise<string> {
    const { user } = body;
    const queryResult = await this.repository.find({ select: { profilePictureName: true }, where: { email: user } });
    const fileName = queryResult[0].profilePictureName;
    if (fileName.length < 1) {
      throw new NotFoundException();
    }
    const fileLocation = `users/${user}/profilePictures/${fileName}`;
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    const file = cookdBucket.file(fileLocation);
    const exists = await file.exists();
    if (exists[0]) {
      return file
        .getSignedUrl({
          action: 'read',
          expires: newDate,
        })
        .then((res) => {
          return res[0];
        });
    } else {
      throw new NotFoundException();
    }
  }
  public async uploadProfilePicture(body: UploadProfilePicture, localFileName: string): Promise<string> {
    const { userEmail } = body;
    const exists = await this.userExists(userEmail);
    if (!exists) throw new NotFoundException();

    try {
      const bucketLocation = `users/${userEmail}/profilePictures/`;

      // resize locally saved image
      await sharp(`./uploads/${localFileName}`).resize(500, 500).withMetadata().toFile(`./uploads/resized-${localFileName}`);

      // upload image to firebase
      await cookdBucket.upload(`./uploads/resized-${localFileName}`, {
        destination: bucketLocation + localFileName,
      });

      // remove old image from bucket.
      const { profilePictureName } = await this.repository.findOne({
        where: { email: userEmail },
        select: { profilePictureName: true },
      });

      if (profilePictureName.length > 0) {
        await cookdBucket
          .file(bucketLocation + profilePictureName)
          .delete()
          .then((result) => {
            if (result[0].statusCode === 204) {
              // success
            }
          })
          .catch(() => {
            console.log("Couldn't delete, item likely doesn't exist.");
          });
      }

      // update database with new string
      await this.repository.update({ email: userEmail }, { profilePictureName: localFileName });
      // remove images from local source
      await fsPromises.unlink(`./uploads/resized-${localFileName}`);
      await fsPromises.unlink(`./uploads/${localFileName}`);

      // return link to profile picture.
      return this.getProfilePicture({ fileName: localFileName, user: userEmail });
    } catch {
      // incase of error.
      await fsPromises.unlink(`./uploads/resized-${localFileName}`);
      await fsPromises.unlink(`./uploads/${localFileName}`);
      throw new InternalServerErrorException();
    }
  }

  private async userExists(email: string): Promise<boolean> {
    const user = await this.repository.findOneBy({ email });
    if (user) return true;
    return false;
  }
}
