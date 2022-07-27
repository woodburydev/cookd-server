import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { cookdChefBucket, cookdChefAdminSDK } from 'src/main';
import { Repository } from 'typeorm';
import { CanCreateCook, CreateCookDto, GetProfilePicture, UpdateCook, UploadProfilePicture } from './cook.dto';
import { Cook } from './cook.entity';
import * as sharp from 'sharp';
import * as fsPromises from 'fs/promises';

@Injectable()
export class CookService {
  @InjectRepository(Cook)
  private readonly repository: Repository<Cook>;

  public async getCook(fbuuid: string): Promise<Cook> {
    const user = await this.repository.findOneBy({ fbuuid: fbuuid });
    return user;
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
    cook.bio = '';
    cook.profilePictureName = '';
    cook.education = '';
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

  public updateCook(body: UpdateCook): Promise<{ status: boolean }> {
    const { bio, education } = body;
    const updateObject = { ...(bio !== undefined && { bio }), ...(education !== undefined && { education }) };
    return this.repository
      .update({ email: body.email }, updateObject)
      .then(() => {
        return {
          status: true,
        };
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          return {
            status: false,
          };
        }
      });
  }

  public fetchCookBioData(email: string): Promise<{ bio: string; education: string }> {
    return this.repository
      .findOne({ select: ['bio', 'education'], where: { email: email } })
      .then((cook) => {
        return {
          bio: cook.bio,
          education: cook.education,
        };
      })
      .catch((err) => {
        console.log(err);
        throw new NotFoundException();
      });
  }

  public async getProfilePicture(body: GetProfilePicture): Promise<string> {
    const { user } = body;
    // if !user throw bad request -> is loading
    // if user but profilePicture is empty string throw not found exception
    if (!user) {
      throw new NotFoundException();
    }
    const queryResult = await this.repository.find({ select: { profilePictureName: true }, where: { email: user } });
    const fileName = queryResult[0].profilePictureName;
    if (fileName.length < 1) {
      throw new NotFoundException();
    }
    const fileLocation = `users/${user}/profilePictures/${fileName}`;
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    const file = cookdChefBucket.file(fileLocation);
    const exists = await file.exists();
    if (exists[0]) {
      return file
        .getSignedUrl({
          action: 'read',
          expires: newDate,
        })
        .then((res) => {
          return JSON.stringify(res[0]);
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
      await cookdChefBucket.upload(`./uploads/resized-${localFileName}`, {
        destination: bucketLocation + localFileName,
      });

      // remove old image from bucket.
      const { profilePictureName } = await this.repository.findOne({
        where: { email: userEmail },
        select: { profilePictureName: true },
      });

      if (profilePictureName.length > 0) {
        await cookdChefBucket
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
