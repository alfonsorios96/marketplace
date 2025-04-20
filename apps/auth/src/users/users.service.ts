import { Injectable, OnModuleInit } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { User, UserRole, UserDocument } from '@repo/shared';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.userModel.deleteMany({});
    await this.generateFakeUsers(10);
  }

  getUserById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id });
  }

  getUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  private async generateFakeUsers(count: number): Promise<User[]> {
    const locales: Array<'es' | 'de'> = ['es', 'de'];

    const users: User[] = [];

    for (let i = 0; i < count; i++) {
      const locale = faker.helpers.arrayElement(locales);
      faker.setLocale(locale);

      const user: User = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        country: locale === 'es' ? 'España' : 'Deutschland',
        role: faker.helpers.arrayElement([UserRole.CUSTOMER, UserRole.SELLER]),
      };

      users.push(user);
    }

    const usersSaved = await this.userModel.insertMany(users);
    const plainUsers: User[] = usersSaved.map((doc) => doc.toObject());
    console.log('🧪 Users fake generated:');
    console.table(plainUsers);

    return plainUsers;
  }
}
