import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

type InitRole = 'admin' | 'super_admin';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((item) => item.startsWith(prefix))?.slice(prefix.length) ?? process.env[`npm_config_${name}`];
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function main() {
  const role = (arg('role') ?? 'admin') as InitRole;
  const force = hasFlag('force');

  if (role !== 'admin' && role !== 'super_admin') {
    throw new Error('Invalid --role. Use admin or super_admin');
  }

  const existingAdmin = await prisma.groupMember.findFirst({
    where: { role: { in: role === 'super_admin' ? ['super_admin'] : ['admin', 'super_admin'] } },
  });

  if (existingAdmin && !force) {
    console.log(`${role} already exists. Skip. Use --force to create/update anyway.`);
    return;
  }

  const email = required('ADMIN_EMAIL or --email', arg('email') ?? process.env.ADMIN_EMAIL);
  const password = required('ADMIN_PASSWORD or --password', arg('password') ?? process.env.ADMIN_PASSWORD);
  const username = (arg('username') ?? process.env.ADMIN_USERNAME ?? email.split('@')[0]).toLowerCase();
  const displayName = arg('name') ?? process.env.ADMIN_NAME ?? (role === 'super_admin' ? 'Super Admin' : 'Admin');
  const phone = arg('phone') ?? process.env.ADMIN_PHONE ?? '0900000000';
  const groupName = arg('group') ?? process.env.ADMIN_GROUP_NAME ?? 'Nhom cau long ABC';
  const inviteCode = arg('invite') ?? process.env.ADMIN_INVITE_CODE ?? 'ABC123';

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.group.upsert({
    where: { invite_code: inviteCode },
    update: { name: groupName },
    create: {
      name: groupName,
      invite_code: inviteCode,
      default_court_fee: 450000,
      default_shuttlecock_price: 25000,
      rounding_rule: 'thousand',
      schedule: { text: 'Thu 3, 5, 7 - 19:00' },
    },
  });

  const group = await prisma.group.findUniqueOrThrow({ where: { invite_code: inviteCode } });

  await prisma.member.upsert({
    where: { username },
    update: { email, password_hash: passwordHash, display_name: displayName, phone, status: 'active' },
    create: { username, email, password_hash: passwordHash, display_name: displayName, phone, status: 'active' },
  });

  const member = await prisma.member.findUniqueOrThrow({ where: { username } });

  await prisma.groupMember.upsert({
    where: { group_id_member_id: { group_id: group.id, member_id: member.id } },
    update: { role, type: 'fixed', status: 'active' },
    create: { group_id: group.id, member_id: member.id, role, type: 'fixed', status: 'active', balance: 0 },
  });

  console.log(`${role} ready: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
