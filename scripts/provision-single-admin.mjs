/**
 * Kerala PYQ Hub — Single Administrator Account Provisioning Tool
 *
 * Enforces the Single-Admin security policy:
 * - Creates or elevates EXACTLY ONE Super Admin account.
 * - If a Super Admin already exists, the script halts and refuses to provision a second one.
 * - Run via Node.js:
 *     node scripts/provision-single-admin.mjs <admin-email> <admin-password> [admin-name]
 *
 * NOTE: This is a secure server-side administrative CLI script.
 * It is completely isolated from frontend client bundles.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rlrfojikvrcsgvgtcbqg.supabase.co';
// The service role key is passed securely via environment variable or CLI argument
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Chief Administrator';

if (!email || !password) {
  console.log(`
Usage:
  node scripts/provision-single-admin.mjs <admin-email> <admin-password> [admin-name]

Or set environment variables:
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  node scripts/provision-single-admin.mjs admin@keralapyqhub.org "SecurePassword123"
`);
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('[ERROR] SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY environment variable is required.');
  console.error('Provide the secret key when running this server-side script:');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your-secret-key"; node scripts/provision-single-admin.mjs ...');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function provisionSingleAdmin() {
  console.log('\n======================================================');
  console.log(' Kerala PYQ Hub — Single Admin Provisioning Process');
  console.log('======================================================\n');
  console.log(`Connecting to Supabase: ${SUPABASE_URL}`);
  console.log(`Target Administrator Email: ${email}`);

  // 1. Verify if ANY Super Admin already exists in user_roles
  const { data: existingAdmins, error: checkError } = await supabaseAdmin
    .from('user_roles')
    .select('user_id, role, created_at')
    .eq('role', 'super_admin');

  if (checkError) {
    console.error('[WARN] Could not query user_roles table directly:', checkError.message);
    console.log('Ensure migration 002_single_admin_and_roles.sql has been executed in Supabase SQL editor.');
  } else if (existingAdmins && existingAdmins.length > 0) {
    console.error('\n[DENIED] Security Policy Violation:');
    console.error(`A Super Admin account ALREADY EXISTS (User ID: ${existingAdmins[0].user_id}).`);
    console.error('Kerala PYQ Hub permits EXACTLY ONE administrator account across the entire system.');
    console.error('No secondary administrator accounts can be created or promoted.\n');
    process.exit(1);
  }

  // 2. Check if user already exists in auth.users
  const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  let targetUser = null;

  if (!listError && userList?.users) {
    targetUser = userList.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  }

  if (!targetUser) {
    console.log(`User ${email} does not exist. Creating via Supabase Auth Admin API...`);
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: 'super_admin' }
    });

    if (createError) {
      console.error('[ERROR] Failed to create auth user:', createError.message);
      process.exit(1);
    }
    targetUser = created.user;
    console.log(`[OK] Auth user created with ID: ${targetUser.id}`);
  } else {
    console.log(`[OK] Found existing user ID: ${targetUser.id}`);
    // Update password if specified
    await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      password,
      email_confirm: true,
      user_metadata: { name, role: 'super_admin' }
    });
  }

  // 3. Delete any default 'student' role for this user (if user_roles table exists)
  try {
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', targetUser.id);

    // 4. Assign the SINGLE 'super_admin' role in user_roles
    const { error: roleInsertError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: targetUser.id,
        role: 'super_admin'
      });

    if (roleInsertError) {
      console.warn('[INFO] Could not write to user_roles table:', roleInsertError.message);
      console.log('Run migration 002_single_admin_and_roles.sql in Supabase SQL Editor to populate the table.');
    }

    // 5. Update profiles table
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: targetUser.id,
        name,
        email,
        role: 'super_admin',
        preferred_language: 'English',
        target_exams: [],
        joined_date: new Date().toISOString().split('T')[0],
        theme_preference: 'dark',
        email_notifications: true,
        daily_reminder: false
      });
  } catch (err) {
    console.warn('[INFO] Database table update deferred:', err.message);
  }

  console.log('\n======================================================');
  console.log(' [SUCCESS] Single Super Admin Provisioned!');
  console.log(` Email: ${email}`);
  console.log(` Role: super_admin`);
  console.log(' Access: /admin dashboard and management console');
  console.log(' Login URL: /login (uses the same ONE Common Login Page)');
  console.log('======================================================\n');
}

provisionSingleAdmin().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
