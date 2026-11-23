import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
    if (m && !out[m[1]]) {
      let v = m[2].trim().replace(/^['"]|['"]$/g, '');
      if (v && !v.startsWith('#')) out[m[1]] = v;
    }
  }
  return out;
}

const staging = readEnv('.env.test.local');
const prod = { ...readEnv('.env.local'), ...readEnv('.env') };

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((k) => !staging[k]);
if (missing.length) {
  console.error('STAGING-ENV-MISSING: ' + missing.join(', '));
  console.error('Create .env.test.local with staging Supabase URL, anon key, and service role key.');
  process.exit(2);
}

function parseProjectUrl(value, label) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.supabase.co') || url.pathname !== '/') {
      throw new Error();
    }
    return url;
  } catch {
    console.error(`${label} must be a Supabase Project URL, e.g. https://<project-ref>.supabase.co`);
    process.exit(2);
  }
}

const stagingUrl = parseProjectUrl(staging.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL in .env.test.local');
const prodUrl = prod.NEXT_PUBLIC_SUPABASE_URL
  ? parseProjectUrl(prod.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL in .env.local/.env')
  : null;
const stagingHost = stagingUrl.hostname;
const prodHost = prodUrl?.hostname ?? null;
if (prodHost && prodHost === stagingHost && process.env.ALLOW_SAME_PROJECT !== '1') {
  console.error('REFUSED: .env.test.local points at the same Supabase project as production.');
  console.error('Use a separate staging project, or set ALLOW_SAME_PROJECT=1 only for an intentional test.');
  process.exit(2);
}

const service = createClient(stagingUrl.origin, staging.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anon = createClient(stagingUrl.origin, staging.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const serviceProbe = await service.from('profiles').select('id').limit(1);
if (serviceProbe.error) {
  console.error(`SERVICE-GRANT-MISSING: ${serviceProbe.error.message}`);
  console.error('Run the updated docs/migrations/2026-11-22_admin_security.sql in staging SQL Editor.');
  process.exit(2);
}

const stamp = Date.now().toString(36);
const adminEmail = `kainara-test-admin-${stamp}@example.com`;
const userEmail = `kainara-test-user-${stamp}@example.com`;
const password = `TestAdmin!${stamp}`;
const userIds = [];
const results = [];
let failed = false;

function check(name, passed, detail = '') {
  results.push({ name, passed, detail });
  if (!passed) failed = true;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}${detail ? `: ${detail}` : ''}`);
}

async function createUser(email) {
  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nama: 'Kainara Test' },
  });
  if (error) throw new Error(`createUser ${email}: ${error.message}`);
  userIds.push(data.user.id);
  return data.user;
}

async function signIn(email) {
  const client = createClient(stagingUrl.origin, staging.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`signIn ${email}: ${error.message}`);
  return client;
}

try {
  const audit = await service
    .from('admin_audit_log')
    .select('id, actor_id, target_id')
    .in('target_id', userIds)
    .limit(1);
  check('migration applied: admin_audit_log exists', !audit.error, audit.error?.message);

  const anonRead = await anon.from('admin_audit_log').select('id').limit(1);
  check('anon cannot read audit log', anonRead.error?.code === '42501', anonRead.error?.code);

  const anonWrite = await anon.from('admin_audit_log').insert({ aksi: 'test', target_tabel: 'test' });
  check('anon cannot write audit log', anonWrite.error?.code === '42501', anonWrite.error?.code);

  const testAdmin = await createUser(adminEmail);
  const testUser = await createUser(userEmail);
  await service.from('profiles').update({ role: 'admin' }).eq('id', testAdmin.id);

  const userClient = await signIn(userEmail);
  const { data: userOwn, error: userOwnError } = await userClient
    .from('profiles')
    .select('id')
    .eq('id', testUser.id);
  check('user can read own profile', !userOwnError && userOwn?.length === 1, userOwnError?.message);

  const userOtherProfiles = await userClient
    .from('profiles')
    .select('id')
    .neq('id', testUser.id);
  check(
    'user cannot read other profiles',
    !userOtherProfiles.error && userOtherProfiles.data?.length === 0,
    userOtherProfiles.error?.message ?? `rows=${userOtherProfiles.data?.length}`,
  );

  const userAuditRead = await userClient.from('admin_audit_log').select('id').limit(1);
  check('non-admin user cannot read audit log', userAuditRead.data?.length === 0, userAuditRead.error?.code);

  const userAuditWrite = await userClient
    .from('admin_audit_log')
    .insert({ aksi: 'test', target_tabel: 'test' });
  check('non-admin user cannot write audit log', userAuditWrite.error?.code === '42501', userAuditWrite.error?.code);

  const userEscalation = await userClient
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', testUser.id)
    .select('id');
  const userAfterSelfRole = await service.from('profiles').select('role').eq('id', testUser.id).single();
  check(
    'non-admin cannot escalate own role',
    !userEscalation.error && userEscalation.data?.length === 1 && userAfterSelfRole.data?.role === 'user',
    userEscalation.error?.message ?? `rows=${userEscalation.data?.length}, role=${userAfterSelfRole.data?.role}`,
  );

  const otherUpdate = await userClient
    .from('profiles')
    .update({ is_active: false })
    .eq('id', testAdmin.id)
    .select('id');
  check(
    'non-admin cannot change another profile',
    !otherUpdate.error && otherUpdate.data?.length === 0,
    otherUpdate.error?.message ?? `rows=${otherUpdate.data?.length}`,
  );

  const adminClient = await signIn(adminEmail);
  const adminAudit = await adminClient
    .from('admin_audit_log')
    .select('id')
    .eq('target_id', testUser.id)
    .limit(1);
  check(
    'active admin can read audit log',
    !adminAudit.error,
    adminAudit.error?.message ?? `rows=${adminAudit.data?.length}`,
  );

  const roleChange = await adminClient
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', testUser.id)
    .select('id');
  check(
    'admin can change another user role',
    !roleChange.error && roleChange.data?.length === 1,
    roleChange.error?.message ?? `rows=${roleChange.data?.length}`,
  );

  const targetAfterRole = await service.from('profiles').select('role').eq('id', testUser.id).single();
  check('role change applied', targetAfterRole.data?.role === 'admin');

  const roleAudit = await service
    .from('admin_audit_log')
    .select('actor_id, target_id, detail')
    .eq('target_id', testUser.id)
    .eq('actor_id', testAdmin.id)
    .eq('aksi', 'profile_role_status')
    .limit(1);
  check(
    'role change is audited',
    roleAudit.data?.some((row) => row.detail?.role?.[1] === 'admin'),
    JSON.stringify(roleAudit.data?.[0] ?? null),
  );

  const selfRole = await adminClient.from('profiles').update({ role: 'user' }).eq('id', testAdmin.id);
  check('admin cannot demote self', selfRole.error?.code === '42501', selfRole.error?.code);

  const selfStatus = await adminClient.from('profiles').update({ is_active: false }).eq('id', testAdmin.id);
  check('admin cannot deactivate self', selfStatus.error?.code === '42501', selfStatus.error?.code);
} catch (error) {
  failed = true;
  console.error(`FAIL script error: ${error.message}`);
} finally {
  if (userIds.length) {
    await service.from('admin_audit_log').delete().in('target_id', userIds);
    await service.from('admin_audit_log').delete().in('actor_id', userIds);
    for (const id of userIds) {
      await service.auth.admin.deleteUser(id);
    }
  }
}

console.log(failed ? 'RESULT: FAIL' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
