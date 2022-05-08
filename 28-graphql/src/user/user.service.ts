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

  async findOneById(userId: number): Promise<User> {
    const userData = await this.userModel.findByPk(userId);

    return userData;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  create(userData): Promise<User> {
    return this.userModel.create(userData);
  }

  async update(userId: number, userData: User) {
    await this.userModel.update(userData, { where: { id: userId }, individualHooks: true });

    const user = await this.userModel.findByPk(userId);

    return user;
  }

  block(userId: number) {
    const isActive = false;

    return this.userModel.update({ isActive }, { where: { id: userId } });
  }
}
