'use client';

import { supabase } from '@/lib/supabase-client';

/** Thin helpers over Supabase for the dashboard's website editor. Row-level security decides who can do what. */
export type Row = Record<string, unknown> & { id?: string };

const sb = () => {
  const c = supabase();
  if (!c) throw new Error('The website editor needs the live backend. This copy of the site runs in demo mode.');
  return c;
};
const check = <T,>({ data, error }: { data: T; error: { message: string } | null }) => {
  if (error) throw new Error(error.message);
  return data;
};

export const isLive = () => !!supabase();

export async function list(table: string, order: string, ascending = true): Promise<Row[]> {
  return check(await sb().from(table).select('*').order(order, { ascending })) as Row[];
}

export async function save(table: string, row: Row): Promise<Row> {
  const { id, created_at: _c, updated_at: _u, updated_by: _b, ...rest } = row;
  const q = id ? sb().from(table).update(rest).eq('id', id) : sb().from(table).insert(rest);
  return check(await q.select('*').single()) as Row;
}

export async function remove(table: string, id: string) {
  check(await sb().from(table).delete().eq('id', id));
}

export async function getSetting<T>(key: string): Promise<T | null> {
  const r = check(await sb().from('site_settings').select('value').eq('key', key).maybeSingle()) as { value: T } | null;
  return r?.value ?? null;
}

export async function setSetting(key: string, value: unknown) {
  check(await sb().from('site_settings').upsert({ key, value }));
}

/** Uploads an image or PDF to the public media library and returns its address. */
export async function upload(file: File, folder = 'uploads'): Promise<string> {
  if (file.size > 8 * 1024 * 1024) throw new Error('Files must be under 8 MB. Resize large photos before uploading.');
  const clean = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
  const path = `${folder}/${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 7)}-${clean}`;
  check(await sb().storage.from('site-media').upload(path, file, { cacheControl: '31536000', contentType: file.type }));
  return sb().storage.from('site-media').getPublicUrl(path).data.publicUrl;
}

/** Asks Cloudflare to rebuild the site, so dashboard changes get their own pages and reach search engines. */
export async function publishSite(): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await sb().functions.invoke('publish-site', { body: {} });
  if (error) return { ok: false, message: 'Publishing is not set up yet. Stories, the announcement and the news list already update without it.' };
  return data as { ok: boolean; message: string };
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export function csvDownload(name: string, rows: (string | number | null | undefined)[][]) {
  const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
