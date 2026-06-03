import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@portfolio.dev' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.admin.create({
      data: {
        name: 'System Admin',
        email: 'admin@portfolio.dev',
        password: hashedPassword,
      },
    });
    console.log('Created default admin:', admin.email);
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
