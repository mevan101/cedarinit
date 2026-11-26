const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');

const output = mkdtempSync(path.join(tmpdir(), 'cedar-auth-test-'));
let authDestination, authCallbackUrl, accountDestination;

before(() => {
  execFileSync(process.execPath, [
    require.resolve('typescript/lib/tsc.js'), path.join(__dirname, '../lib/auth-redirect.ts'),
    '--outDir', output, '--module', 'commonjs', '--target', 'ES2020', '--strict', '--skipLibCheck',
  ]);
  ({ authDestination, authCallbackUrl, accountDestination } = require(path.join(output, 'auth-redirect.js')));
});
after(() => rmSync(output, { recursive: true, force: true }));

test('keeps the chosen role and application anchor after one query decode', () => {
  const next = new URLSearchParams('next=%2Fopportunities%2Fcampus-ambassador%2F%23apply').get('next');
  assert.equal(authDestination(next), '/opportunities/campus-ambassador/#apply');
  assert.equal(authDestination('/staff/'), '/staff/');
});

test('does not double-decode escaped query values', () => {
  const destination = '/opportunities/?search=100%25&role=research#apply';
  const next = new URLSearchParams({ next: destination }).get('next');
  assert.equal(authDestination(next), destination);
});

test('rejects external, protocol-relative, backslash and normalised off-site destinations', () => {
  for (const value of [
    'https://example.org/', '//example.org/', '///example.org/', '/\\example.org/',
    '/\n/example.org/', '/.//example.org/', '/%2e%2e//example.org/', 'javascript:alert(1)',
  ]) assert.equal(authDestination(value), '/account/', JSON.stringify(value));
});

test('malformed escapes and missing destinations fall back without crashing', () => {
  for (const value of [undefined, null, '', 'account/', '/%', '/%ZZ', '/%E0%A4']) {
    assert.equal(authDestination(value), '/account/', JSON.stringify(value));
  }
});

test('email confirmation and magic links carry the full role destination through the account callback', () => {
  const destination = '/opportunities/campus-ambassador/?source=home&kind=student#apply';
  const callback = new URL(authCallbackUrl('https://cedar-initiative.org', destination));
  assert.equal(callback.origin, 'https://cedar-initiative.org');
  assert.equal(callback.pathname, '/account/');
  assert.equal(callback.searchParams.get('next'), destination);
  assert.equal(accountDestination(callback.search), destination);
});

test('ordinary sign-in keeps the existing account callback and unsafe email returns are discarded', () => {
  for (const next of [undefined, '/account/', '//example.org/']) {
    assert.equal(authCallbackUrl('https://cedar-initiative.org', next), 'https://cedar-initiative.org/account/');
  }
  assert.equal(accountDestination(''), null);
  assert.equal(accountDestination('?next=%2F%2Fexample.org'), '/account/');
});

test('password recovery takes precedence over a role return', () => {
  assert.equal(accountDestination('?reset=1&next=%2Fopportunities%2Fcampus-ambassador%2F%23apply'), null);
  assert.equal(accountDestination('?reset=1'), null);
});
