import { put } from '@vercel/blob';

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file) return Response.json({ error: 'No file' }, { status: 400 });

    const ext  = file.name.split('.').pop();
    const name = `tokens/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const blob = await put(name, file, { access: 'public' });
    return Response.json({ url: blob.url });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
