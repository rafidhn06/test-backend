import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

async function main() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    allowPublicKeyRetrieval: true,
  });
  const prisma = new PrismaClient({ adapter });

  console.log('Cleaning up database...');
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Seeding admin user...');
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
    },
  });

  console.log('Seeding random users and posts...');
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
      },
    });

    const postCount = faker.number.int({ min: 3, max: 7 });
    for (let j = 0; j < postCount; j++) {
      await prisma.post.create({
        data: {
          content: faker.lorem.paragraphs(2),
          authorId: user.id,
          createdAt: faker.date.past(),
        },
      });
    }
  }

  for (let i = 0; i < 5; i++) {
    await prisma.post.create({
      data: {
        content: faker.lorem.paragraphs(2),
        authorId: admin.id,
        createdAt: faker.date.past(),
      },
    });
  }

  console.log('Seeding completed.');
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
