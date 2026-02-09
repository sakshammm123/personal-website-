import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      console.log('❌ Admin account already exists!');
      console.log('   If you want to create a new one, delete the existing admin first.');
      process.exit(1);
    }

    // Get username and password from command line or use defaults
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';

    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    console.log('✅ Admin account created successfully!');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Please change the default password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
