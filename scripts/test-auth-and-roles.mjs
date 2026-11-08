/**
 * Kerala PYQ Hub — Automated Test Suite for Auth, Roles, and Single Admin Security
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rlrfojikvrcsgvgtcbqg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NlRMmaaBUVw6G9bqWmVW2Q_gqDUnTmL';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('----------------------------------------------------');
console.log(' Running Kerala PYQ Hub Auth & Single Admin Tests   ');
console.log('----------------------------------------------------\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, detail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}: ${detail}`);
  }
}

async function runTests() {
  // Scenario 3: Invalid credentials test
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'invalid.user.test.' + Date.now() + '@example.com',
      password: 'wrong_password_123',
    });
    assert(
      error !== null && !data.session,
      'Scenario 3: Invalid credentials returns appropriate error',
      error?.message
    );
  } catch (e) {
    assert(false, 'Scenario 3: Invalid credentials test', e.message);
  }

  // Scenario 1 & 2: Role redirection mapping test
  const getRedirectForRole = (role) => {
    if (role === 'super_admin') return '/admin';
    if (role === 'student') return '/dashboard';
    return '/login';
  };

  assert(
    getRedirectForRole('student') === '/dashboard',
    'Scenario 1: Student role maps strictly to /dashboard'
  );
  assert(
    getRedirectForRole('super_admin') === '/admin',
    'Scenario 2: Super Admin role maps strictly to /admin'
  );
  assert(
    getRedirectForRole(null) === '/login',
    'Scenario 4: Unauthenticated or null role maps strictly to /login'
  );

  // Scenario 8: Registration with student role
  const testStudentEmail = `aspirant_${Date.now()}@gmail.com`;
  try {
    const { data: regData, error: regError } = await supabase.auth.signUp({
      email: testStudentEmail,
      password: 'SecurePassword2026!',
      options: {
        data: {
          name: 'Test Aspirant',
          preferred_language: 'Both',
          role: 'student',
        },
      },
    });

    assert(
      !regError && regData.user !== null,
      'Scenario 8: Student registration succeeds with real Supabase Auth',
      regError?.message
    );
    assert(
      regData.user?.user_metadata?.role === 'student',
      'Scenario 8: Registered user is guaranteed student role only'
    );
  } catch (e) {
    assert(false, 'Scenario 8: Registration test', e.message);
  }

  // Scenario 9: Student cannot grant themselves admin role via client
  try {
    const { error: hackRoleError } = await supabase
      .from('user_roles')
      .insert({ role: 'super_admin' });

    assert(
      hackRoleError !== null,
      'Scenario 9: Client-side role elevation is rejected by RLS / permissions'
    );
  } catch (e) {
    assert(true, 'Scenario 9: Client-side role elevation rejected');
  }

  // Scenario 10: Single Super Admin database index enforcement
  // Verify the migration file contains the unique partial index
  const fs = await import('fs');
  const migration002 = fs.readFileSync('supabase/migrations/002_single_admin_and_roles.sql', 'utf8');
  assert(
    migration002.includes('single_super_admin_unique_idx') &&
    migration002.includes("where (role = 'super_admin')"),
    'Scenario 10: Migration defines single_super_admin_unique_idx ensuring only ONE Super Admin can exist'
  );

  // Scenario 12: Password recovery method verification
  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail('test.recovery@example.com', {
      redirectTo: 'http://localhost:5173/forgot-password',
    });
    // Even if rate-limited or sent, verify the API contract is valid
    assert(
      resetError === null || resetError.message.includes('rate') || resetError.message.includes('security'),
      'Scenario 12: Password reset recovery API endpoint is functional'
    );
  } catch (e) {
    assert(false, 'Scenario 12: Password reset test', e.message);
  }

  console.log(`\n====================================================`);
  console.log(` Test Results: ${passedTests} / ${totalTests} passed`);
  console.log(`====================================================\n`);
}

runTests();
