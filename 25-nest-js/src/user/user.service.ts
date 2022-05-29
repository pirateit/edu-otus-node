import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  create(userData): Promise<User> {
    return this.userModel.create(userData);
  }

  update(userId: number, userData: User) {
    return this.userModel.update(userData, { where: { id: userId } });
  }

  block(userId: number) {
    const isActive = false;

    return this.userModel.update({ isActive }, { where: { id: userId } });
  }
}
