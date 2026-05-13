import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
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
  const supabaseUrl = required('SUPABASE_URL', process.env.SUPABASE_URL);
  const supabaseSecretKey = required('SUPABASE_SECRET_KEY', process.env.SUPABASE_SECRET_KEY);
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
  const displayName = arg('name') ?? process.env.ADMIN_NAME ?? (role === 'super_admin' ? 'Super Admin' : 'Admin');
  const phone = arg('phone') ?? process.env.ADMIN_PHONE ?? '0900000000';
  const groupName = arg('group') ?? process.env.ADMIN_GROUP_NAME ?? 'Nhom cau long ABC';
  const inviteCode = arg('invite') ?? process.env.ADMIN_INVITE_CODE ?? 'ABC123';

  const supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existingAuthUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  const existingUser = existingAuthUsers.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  const authUser = existingUser
    ? existingUser
    : (
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { display_name: displayName, phone },
        })
      ).data.user;

  if (!authUser) throw new Error('Cannot create Supabase auth user');

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
    where: { id: authUser.id },
    update: { email, display_name: displayName, phone, status: 'active' },
    create: { id: authUser.id, email, display_name: displayName, phone, status: 'active' },
  });

  await prisma.groupMember.upsert({
    where: { group_id_member_id: { group_id: group.id, member_id: authUser.id } },
    update: { role, type: 'fixed', status: 'active' },
    create: { group_id: group.id, member_id: authUser.id, role, type: 'fixed', status: 'active', balance: 0 },
  });

  console.log(`${role} ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
