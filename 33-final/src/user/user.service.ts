import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contact } from './contact.model';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Contact)
    private contactModel: typeof Contact,
  ) { }

  findOneById(userId: number): Promise<User> {
    return this.userModel.findByPk(userId, {
      attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'points', 'rating', 'role']
    });
  }

  async findOneByEmailOrPhone(login: string): Promise<User> {
    let user: User;
    const phoneRegex = /^(\+7|[78])?[0-9]{10}$/;
    login = login.replace(/[\+\s()-]/g, '').toLowerCase();

    if (login.match(phoneRegex)) {
      login = login.replace(/(\+7)|8/g, '7');
      user = await this.userModel.findOne({ where: { phone: login } });
    } else {
      user = await this.userModel.findOne({ where: { email: login } });
    }

    return user;
  }

  create(userData): Boolean {
    this.userModel.create(userData);

    return true;
  }

  update(userId, userData): Promise<any> {
    return this.userModel.update(userData, { where: { id: userId } });
  }

  getContacts(userId: number): Promise<Contact> {
    return this.contactModel.findOne({ where: { user_id: userId } });
  }

  async upsertContact(contactData): Promise<boolean> {
    await this.contactModel.findOrCreate({
      where: { user_id: contactData.user_id },
      defaults: contactData,
    })
    .then(([contact, created]) => {
      if (!created) {
        contact.set(contactData).save();
      }
    });

    return true;
  }
}
