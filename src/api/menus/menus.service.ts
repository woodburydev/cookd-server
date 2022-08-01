import { BadRequestException, ConsoleLogger, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { map } from 'modern-async';
import * as fsPromises from 'fs/promises';
import { CreateMenu, UpdateMenu } from './menus.dto';
import { Menu } from './menus.entity';
import { cookdChefBucket } from 'src/main';

@Injectable()
export class MenusService {
  @InjectRepository(Menu)
  private readonly repository: Repository<Menu>;

  public getMenus(): Promise<Menu[]> {
    return this.repository.find({
      order: {
        title: 'ASC',
      },
    });
  }

  public async getMenusFromUser(fbuuid: string): Promise<Menu[]> {
    const menus = await this.repository.find({
      where: { fbuuid },
      order: {
        title: 'ASC',
      },
    });
    const result = await map(menus, async (item) => {
      if (item.filename) {
        const itemUri = await this.getMenuImage(item.id);
        if (itemUri) {
          return {
            ...item,
            filename: itemUri,
          };
        } else {
          console.log('no response from helper function?');
        }
      } else {
        return item;
      }
    });
    return result;
  }

  public async createMenu(localFileName: string, body: CreateMenu): Promise<{ status: string }> {
    const user: Menu = new Menu();
    user.appetizers = body.appetizers;
    user.description = body.description;
    user.title = body.title;
    user.cost_per_person = parseInt(body.costPerPerson);
    user.fbuuid = body.fbuuid;
    user.entrees = body.entrees;
    user.deserts = body.deserts;
    user.extras = body.extras;
    user.filename = '';

    return this.repository
      .save(user)
      .then(async (menu) => {
        if (!localFileName) {
          return { status: 'success' };
        }
        try {
          const { id } = menu;
          const bucketLocation = `menus/${id}/images/`;
          // resize locally saved image
          await sharp(`./uploads/${localFileName}`).resize(500, 500).withMetadata().toFile(`./uploads/resized-${localFileName}`);

          // upload image to firebase
          await cookdChefBucket
            .upload(`./uploads/resized-${localFileName}`, {
              destination: bucketLocation + localFileName,
            })
            .then((res) => {})
            .catch((err) => {
              console.log('error uploading', err);
            });
          // remove old image from bucket.
          const { filename } = await this.repository.findOne({
            where: { id },
            select: { filename: true },
          });

          if (filename.length > 0) {
            await cookdChefBucket
              .file(bucketLocation + filename)
              .delete()
              .then((result) => {
                if (result[0].statusCode === 204) {
                }
              })
              .catch(() => {
                console.log("Couldn't delete, item likely doesn't exist.");
              });
          }

          // update database with new string
          await this.repository.update({ id }, { filename: localFileName });
          // remove images from local source
          await fsPromises.unlink(`./uploads/resized-${localFileName}`);
          await fsPromises.unlink(`./uploads/${localFileName}`);

          // return link to profile picture.
          return { status: 'success' };
        } catch {
          // incase of error.
          await fsPromises.unlink(`./uploads/resized-${localFileName}`);
          await fsPromises.unlink(`./uploads/${localFileName}`);
          throw new InternalServerErrorException();
        }
      })
      .catch((err) => {
        console.log(err);
        return {
          status: 'error',
        };
      });
  }

  public async getMenuImage(uuid: string) {
    const queryResult = await this.repository.find({ select: { filename: true }, where: { id: uuid } });
    if (!queryResult) {
      throw new BadRequestException();
    }
    const fileName = queryResult[0].filename;
    if (fileName.length < 1) {
      throw new BadRequestException();
    }
    const fileLocation = `menus/${uuid}/images/${fileName}`;
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

  public async updateMenu(localFileName: string, body: UpdateMenu) {
    const { appetizers, description, title, entrees, deserts, extras, id } = body;
    const costPerPerson = parseInt(body.costPerPerson);

    if (!localFileName) {
      return this.repository.update(
        { id },
        { title, description, appetizers, cost_per_person: costPerPerson, entrees, deserts, extras },
      );
    }

    try {
      const bucketLocation = `menus/${id}/images/`;

      // resize locally saved image
      await sharp(`./uploads/${localFileName}`).resize(500, 500).withMetadata().toFile(`./uploads/resized-${localFileName}`);

      // upload image to firebase
      await cookdChefBucket
        .upload(`./uploads/resized-${localFileName}`, {
          destination: bucketLocation + localFileName,
        })
        .then((res) => {})
        .catch((err) => {
          console.log('error uploading', err);
        });
      // remove old image from bucket.
      const { filename } = await this.repository.findOne({
        where: { id },
        select: { filename: true },
      });

      if (filename.length > 0) {
        await cookdChefBucket
          .file(bucketLocation + filename)
          .delete()
          .then((result) => {
            if (result[0].statusCode === 204) {
            }
          })
          .catch(() => {
            console.log("Couldn't delete, item likely doesn't exist.");
          });
      }

      // update database with new string
      await this.repository.update(
        { id },
        { filename: localFileName, title, description, appetizers, cost_per_person: costPerPerson, entrees, deserts, extras },
      );
      // remove images from local source
      await fsPromises.unlink(`./uploads/resized-${localFileName}`);
      await fsPromises.unlink(`./uploads/${localFileName}`);

      // return link to profile picture.
      return 'success';
    } catch {
      // incase of error.
      await fsPromises.unlink(`./uploads/resized-${localFileName}`);
      await fsPromises.unlink(`./uploads/${localFileName}`);
      throw new InternalServerErrorException();
    }
  }
}
