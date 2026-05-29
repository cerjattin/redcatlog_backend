const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  const adminRole = await prisma.role.findFirst({
    where: {
      OR: [{ name: 'admin' }, { name: 'ADMIN' }],
    },
  });

  if (!adminRole) {
    throw new Error('No existe un rol admin/ADMIN en la tabla roles.');
  }

  const passwordHash = await bcrypt.hash('Admin12345*', 10);

  const user = await prisma.user.upsert({
    where: {
      email: 'admin@redmujeres.com',
    },
    update: {},
    create: {
      roleId: adminRole.id,

      firstName: 'Administrador',

      lastName: 'Red Mujeres',

      email: 'admin@redmujeres.com',

      passwordHash,

      status: 'active',

      country: 'Colombia',

      city: 'Barranquilla',

      department: 'Atlántico',

      emailVerifiedAt: new Date(),
    },
  });

  console.log('Admin creado:', user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
