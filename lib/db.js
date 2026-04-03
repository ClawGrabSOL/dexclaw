import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

const KEY = 'dexclaw:db';

async function load() {
  const data = await redis.get(KEY);
  if (!data) return { tokens: [] };
  return typeof data === 'string' ? JSON.parse(data) : data;
}

async function save(data) {
  await redis.set(KEY, JSON.stringify(data));
}

export async function getAllTokens() {
  const db = await load();
  return db.tokens || [];
}

export async function getToken(address) {
  const db = await load();
  return (db.tokens || []).find(t => t.address.toLowerCase() === address.toLowerCase()) || null;
}

export async function createToken(token) {
  const db = await load();
  db.tokens = db.tokens || [];
  db.tokens.unshift(token);
  await save(db);
  return token;
}

export async function updateToken(address, updates) {
  const db = await load();
  const idx = (db.tokens || []).findIndex(t => t.address.toLowerCase() === address.toLowerCase());
  if (idx === -1) return null;
  db.tokens[idx] = { ...db.tokens[idx], ...updates, address: db.tokens[idx].address };
  await save(db);
  return db.tokens[idx];
}

export async function incrementViews(address) {
  const db = await load();
  const idx = (db.tokens || []).findIndex(t => t.address.toLowerCase() === address.toLowerCase());
  if (idx === -1) return;
  db.tokens[idx].views = (db.tokens[idx].views || 0) + 1;
  await save(db);
}
