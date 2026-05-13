import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const groupId = '11111111-1111-4111-8111-111111111111';

const members = [
  { id: '11111111-1111-4111-8111-000000000001', gmId: '22222222-2222-4222-8222-000000000001', role: 'admin', type: 'fixed', balance: 500000, display_name: 'Nguyen Van Hung', username: 'hung', email: 'hung@example.com', phone: '0908123456', created_at: new Date('2024-01-10T08:00:00Z') },
  { id: '11111111-1111-4111-8111-000000000002', gmId: '22222222-2222-4222-8222-000000000002', role: 'member', type: 'fixed', balance: 150000, display_name: 'Tran Tuan Anh', username: 'anh', email: 'anh@example.com', phone: '0912345678', created_at: new Date('2024-01-12T08:00:00Z') },
  { id: '11111111-1111-4111-8111-000000000003', gmId: '22222222-2222-4222-8222-000000000003', role: 'member', type: 'fixed', balance: 1200000, display_name: 'Le Thi Mai', username: 'mai', email: 'mai@example.com', phone: '0933111222', created_at: new Date('2024-01-15T08:00:00Z') },
  { id: '11111111-1111-4111-8111-000000000004', gmId: '22222222-2222-4222-8222-000000000004', role: 'member', type: 'guest', balance: -250000, display_name: 'Pham Minh Khoa', username: 'khoa', email: 'khoa@example.com', phone: '0977888999', created_at: new Date('2024-02-05T08:00:00Z') },
  { id: '11111111-1111-4111-8111-000000000005', gmId: '22222222-2222-4222-8222-000000000005', role: 'member', type: 'fixed', balance: 75000, display_name: 'Hoang Thi Bich', username: 'bich', email: 'bich@example.com', phone: '0944222333', created_at: new Date('2024-02-10T08:00:00Z') },
  { id: '11111111-1111-4111-8111-000000000006', gmId: '22222222-2222-4222-8222-000000000006', role: 'member', type: 'guest', balance: 0, display_name: 'Vu Duc Thanh', username: 'thanh', email: 'thanh@example.com', phone: '0966555444', created_at: new Date('2024-03-01T08:00:00Z') },
  { id: '11111111-1111-4111-8111-000000000007', gmId: '22222222-2222-4222-8222-000000000007', role: 'member', type: 'fixed', balance: 320000, display_name: 'Nguyen Thi Lan', username: 'lan', email: 'lan@example.com', phone: '0955666777', created_at: new Date('2024-03-20T08:00:00Z') },
  { id: '11111111-1111-4111-8111-000000000008', gmId: '22222222-2222-4222-8222-000000000008', role: 'member', type: 'fixed', balance: -80000, display_name: 'Dang Van Long', username: 'long', email: 'long@example.com', phone: '0922444555', created_at: new Date('2024-04-01T08:00:00Z') },
] as const;

const sessions = [
  { id: '33333333-3333-4333-8333-000000000001', date: new Date('2026-04-10'), court_fee: 450000, shuttlecock_qty: 12, shuttlecock_price: 25000, per_person: 93000, attendee_count: 8, remainder: 6000, status: 'settled', note: 'Buoi thu Nam thuong le', created_at: new Date('2026-04-10T07:00:00Z'), attendeeMemberIndexes: [0, 1, 2, 3, 4, 5, 6, 7] },
  { id: '33333333-3333-4333-8333-000000000002', date: new Date('2026-04-07'), court_fee: 450000, shuttlecock_qty: 10, shuttlecock_price: 25000, per_person: 100000, attendee_count: 7, remainder: 0, status: 'settled', note: null, created_at: new Date('2026-04-07T07:00:00Z'), attendeeMemberIndexes: [0, 1, 2, 3, 4, 5, 6] },
  { id: '33333333-3333-4333-8333-000000000003', date: new Date('2026-04-14'), court_fee: 450000, shuttlecock_qty: 0, shuttlecock_price: 25000, per_person: 0, attendee_count: 0, remainder: 0, status: 'pending', note: 'Buoi tap sap toi', created_at: new Date('2026-04-11T09:00:00Z'), attendeeMemberIndexes: [] },
  { id: '33333333-3333-4333-8333-000000000004', date: new Date('2026-04-17'), court_fee: 0, shuttlecock_qty: 0, shuttlecock_price: 25000, per_person: 0, attendee_count: 0, remainder: 0, status: 'draft', note: null, created_at: new Date('2026-04-11T10:00:00Z'), attendeeMemberIndexes: [] },
] as const;

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.group.upsert({
    where: { id: groupId },
    update: {
      name: 'Nhom cau long ABC',
      invite_code: 'ABC123',
      default_court_fee: 450000,
      default_shuttlecock_price: 25000,
      rounding_rule: 'thousand',
      schedule: { text: 'Thu 3, 5, 7 - 19:00 tai San A' },
    },
    create: {
      id: groupId,
      name: 'Nhom cau long ABC',
      invite_code: 'ABC123',
      default_court_fee: 450000,
      default_shuttlecock_price: 25000,
      rounding_rule: 'thousand',
      schedule: { text: 'Thu 3, 5, 7 - 19:00 tai San A' },
    },
  });

  for (const member of members) {
    await prisma.member.upsert({
      where: { id: member.id },
      update: {
        email: member.email,
        username: member.username,
        password_hash: passwordHash,
        display_name: member.display_name,
        phone: member.phone,
        status: 'active',
      },
      create: {
        id: member.id,
        email: member.email,
        username: member.username,
        password_hash: passwordHash,
        display_name: member.display_name,
        phone: member.phone,
        status: 'active',
        created_at: member.created_at,
      },
    });

    await prisma.groupMember.upsert({
      where: { id: member.gmId },
      update: {
        role: member.role,
        type: member.type,
        balance: member.balance,
        status: 'active',
      },
      create: {
        id: member.gmId,
        group_id: groupId,
        member_id: member.id,
        role: member.role,
        type: member.type,
        balance: member.balance,
        status: 'active',
        joined_at: member.created_at,
      },
    });
  }

  for (const [sessionIndex, session] of sessions.entries()) {
    await prisma.session.upsert({
      where: { id: session.id },
      update: {
        date: session.date,
        court_fee: session.court_fee,
        shuttlecock_qty: session.shuttlecock_qty,
        shuttlecock_price: session.shuttlecock_price,
        attendee_count: session.attendee_count,
        per_person: session.per_person,
        remainder: session.remainder,
        status: session.status,
        note: session.note,
      },
      create: {
        id: session.id,
        group_id: groupId,
        created_by: members[0].id,
        date: session.date,
        court_fee: session.court_fee,
        shuttlecock_qty: session.shuttlecock_qty,
        shuttlecock_price: session.shuttlecock_price,
        attendee_count: session.attendee_count,
        per_person: session.per_person,
        remainder: session.remainder,
        status: session.status,
        note: session.note,
        created_at: session.created_at,
      },
    });

    for (const memberIndex of session.attendeeMemberIndexes) {
      const member = members[memberIndex];
      const attendanceId = `44444444-4444-4444-8444-${String((sessionIndex + 1) * 100 + memberIndex + 1).padStart(12, '0')}`;
      await prisma.attendance.upsert({
        where: { session_id_member_id: { session_id: session.id, member_id: member.id } },
        update: { is_present: true, amount_charged: session.per_person },
        create: {
          id: attendanceId,
          session_id: session.id,
          member_id: member.id,
          is_present: true,
          amount_charged: session.per_person,
        },
      });
    }
  }

  await prisma.transaction.upsert({
    where: { id: '55555555-5555-4555-8555-000000000001' },
    update: { amount: 200000, balance_after: 350000, note: 'Nop tien quy thang 4' },
    create: {
      id: '55555555-5555-4555-8555-000000000001',
      group_member_id: members[1].gmId,
      session_id: sessions[1].id,
      type: 'deposit',
      amount: 200000,
      balance_after: 350000,
      note: 'Nop tien quy thang 4',
      created_at: new Date('2026-04-09T10:30:00Z'),
    },
  });

  await prisma.transaction.upsert({
    where: { id: '55555555-5555-4555-8555-000000000002' },
    update: { amount: -93000, balance_after: 257000, note: 'Buoi tap 10/04/2026' },
    create: {
      id: '55555555-5555-4555-8555-000000000002',
      group_member_id: members[1].gmId,
      session_id: sessions[0].id,
      type: 'session_charge',
      amount: -93000,
      balance_after: 257000,
      note: 'Buoi tap 10/04/2026',
      created_at: new Date('2026-04-10T09:00:00Z'),
    },
  });

  await prisma.transaction.upsert({
    where: { id: '55555555-5555-4555-8555-000000000003' },
    update: { amount: -100000, balance_after: 150000, note: 'Buoi tap 07/04/2026' },
    create: {
      id: '55555555-5555-4555-8555-000000000003',
      group_member_id: members[1].gmId,
      session_id: sessions[1].id,
      type: 'session_charge',
      amount: -100000,
      balance_after: 150000,
      note: 'Buoi tap 07/04/2026',
      created_at: new Date('2026-04-07T09:00:00Z'),
    },
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
