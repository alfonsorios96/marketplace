import { Injectable, OnModuleInit } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { User, UserRole } from '@repo/shared';

@Injectable()
export class UsersService implements OnModuleInit {
  private users: User[] = [];

  onModuleInit() {
    this.generateFakeUsers(10);
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUsers(): User[] {
    return this.users;
  }

  private generateFakeUsers(count: number) {
    const locales: Array<'es' | 'de'> = ['es', 'de'];

    for (let i = 0; i < count; i++) {
      const locale = faker.helpers.arrayElement(locales);
      faker.setLocale(locale);

      const user: User = {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        country: locale === 'es' ? 'España' : 'Deutschland',
        role: faker.helpers.arrayElement([UserRole.CUSTOMER, UserRole.SELLER]),
      };

      this.users.push(user);
    }
    console.log('🧪 Users fake generated:');
    console.table(this.users);
  }
}
