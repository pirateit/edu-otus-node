import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { Album } from './album.model';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Album)
    private albumModel: typeof Album,
  ) { }

  findOne(albumId: number): Promise<Album> {
    return this.albumModel.findByPk(albumId, { include: [
      {
        model: User,
        attributes: ['id', 'first_name', 'last_name']
      }
    ] });
  }

  findAll(): Promise<Album[]> {
    return this.albumModel.findAll({ include: [
      {
        model: User,
        attributes: ['id', 'first_name', 'last_name']
      }
    ] });
  }

  findActive(active?: boolean): Promise<Album[]> {
    let where = { is_active: true };

    if (typeof active == 'boolean') where.is_active = active;

    return this.albumModel.findAll({ where, include: [
      {
        model: User,
        attributes: ['id', 'first_name', 'last_name']
      }
    ] });
  }

  create(albumData): Promise<Album> {
    return this.albumModel.create(albumData);
  }

  delete(albumId: number): Promise<any> {
    return this.albumModel.destroy({ where: { id: albumId } })
  }
}
