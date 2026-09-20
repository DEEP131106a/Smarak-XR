import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

process.env.JWT_SECRET ??= 'test-only-secret-that-is-at-least-32-characters-long';

let server: Server;
let baseUrl = '';

before(async () => {
  const { app } = await import('../src/index');
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

async function request(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${baseUrl}${path}`, init);
}

test('reports API health', async () => {
  const response = await request('/');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    message: 'Welcome to the Smarak-XR API!',
    status: 'running',
  });

});

test('reports liveness and database readiness', async () => {
  const live = await request('/health/live');
  assert.equal(live.status, 200);
  assert.deepEqual(await live.json(), { status: 'ok' });

  const ready = await request('/health/ready');
  assert.equal(ready.status, 200);
  assert.deepEqual(await ready.json(), { status: 'ready' });
});

test('rejects malformed registration payloads', async () => {
  const response = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'x', email: 'not-an-email', password: 'short' }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /required|invalid/i);
});

test('registers, authenticates, and clears a cookie session', async () => {
  const username = `test-${Date.now()}`;
  const register = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email: `${username}@example.com`,
      name: 'API Test User',
      password: 'valid-password-123',
      specialization: 'Explorer',
    }),
  });
  assert.equal(register.status, 201);
  assert.ok(register.headers.get('set-cookie')?.startsWith('smarak_auth='));
  const cookie = register.headers.get('set-cookie')!.split(';')[0];

  const me = await request('/api/auth/me', { headers: { Cookie: cookie } });
  assert.equal(me.status, 200);
  const meBody = await me.json();
  assert.equal(meBody.user.username, username);
  assert.equal(meBody.user.specialization, 'Explorer');
  assert.equal(meBody.user.points, 100);

  const logout = await request('/api/auth/logout', { method: 'POST', headers: { Cookie: cookie } });
  assert.equal(logout.status, 204);
  assert.match(logout.headers.get('set-cookie') || '', /Max-Age=0/);
});

test('awards story submission points and exposes reward progress', async () => {
  const username = `story-${Date.now()}`;
  const register = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email: `${username}@example.com`, name: 'Story User', password: 'valid-password-123' }),
  });
  const cookie = register.headers.get('set-cookie')!.split(';')[0];
  const story = await request('/api/heritage/stories', {
    method: 'POST',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'A local tradition', shortStory: 'A story worth preserving', category: 'food',
      region: 'North', state: 'Punjab',
    }),
  });
  assert.equal(story.status, 201);
  const body = await story.json();
  assert.equal(body.reward.pointsAwarded, 25);
  assert.equal(body.reward.totalPoints, 125);
  assert.equal(body.reward.level, 1);

  const profile = await request('/api/profile/me', { headers: { Cookie: cookie } });
  const profileBody = await profile.json();
  assert.equal(profileBody.user.points, 125);
  assert.equal(profileBody.user.levelProgress, 125);
  assert.equal(profileBody.user.pointsToNextLevel, 25);
});

test('lists rewards and records a one-time unlocked reward claim', async () => {
  const username = `reward-${Date.now()}`;
  const register = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email: `${username}@example.com`, name: 'Reward User', password: 'valid-password-123' }),
  });
  const cookie = register.headers.get('set-cookie')!.split(';')[0];

  const rewards = await request('/api/rewards', { headers: { Cookie: cookie } });
  assert.equal(rewards.status, 200);
  const rewardBody = await rewards.json();
  assert.ok(rewardBody.rewards.some((reward: { id: string }) => reward.id === 'smarak-tshirt'));

  const claim = await request('/api/rewards/heritage-explorer-badge/redeem', {
    method: 'POST',
    headers: { Cookie: cookie },
  });
  assert.equal(claim.status, 201);

  const duplicate = await request('/api/rewards/heritage-explorer-badge/redeem', {
    method: 'POST',
    headers: { Cookie: cookie },
  });
  assert.equal(duplicate.status, 409);
});

test('throttles repeated registration attempts', async () => {
  const requests = await Promise.all(
    Array.from({ length: 11 }, () => request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'rate-test', email: 'rate-test@example.com', name: 'Rate Test', password: 'bad' }),
    })),
  );
  assert.equal(requests.at(-1)?.status, 429);
});

test('protects user-owned and admin endpoints', async () => {
  const storyResponse = await request('/api/heritage/stories/me');
  const adminResponse = await request('/api/admin/moderation/stories');
  assert.equal(storyResponse.status, 401);
  assert.equal(adminResponse.status, 401);
});

test('serves public database-backed content routes', async () => {
  const [culture, states, stories, food, dance, uttarakhandMusic] = await Promise.all([
    request('/api/culture/items'),
    request('/api/explore/states'),
    request('/api/heritage/stories'),
    request('/api/heritage/adopt?search=food&category=food'),
    request('/api/heritage/adopt?search=dance&category=dance'),
    request('/api/heritage/adopt?category=music&location=Uttarakhand'),
  ]);
  assert.equal(culture.status, 200);
  assert.equal(states.status, 200);
  assert.equal(stories.status, 200);
  assert.equal(food.status, 200);
  assert.equal(dance.status, 200);
  assert.ok(Array.isArray(await culture.json()));
  assert.ok(Array.isArray(await states.json()));
  assert.ok((await uttarakhandMusic.json()).length > 0);
  assert.ok(Array.isArray(await stories.json()));
  assert.ok((await food.json()).length > 1);
  assert.ok((await dance.json()).length > 1);
});
