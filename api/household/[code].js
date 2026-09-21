import { head, put } from '@vercel/blob';
import { isValidHouseholdCode, isPayloadWithinLimit } from '../../household.js';

function blobPathname(code) {
  return 'households/' + code + '.json';
}

export default async function handler(req, res) {
  const code = req.query.code;

  if (!isValidHouseholdCode(code)) {
    res.status(400).json({ error: 'invalid_code' });
    return;
  }

  const pathname = blobPathname(code);

  if (req.method === 'GET') {
    try {
      const meta = await head(pathname);
      const upstream = await fetch(meta.url);
      const text = await upstream.text();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(text);
    } catch (err) {
      if (err && /does not exist|not_found/i.test(String(err.message || ''))) {
        res.status(200).json({ empty: true });
        return;
      }
      console.error('household GET failed', err && err.stack || err);
      res.status(502).json({ error: 'storage_error' });
    }
    return;
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    let bodyText;
    try {
      bodyText = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    } catch (e) {
      res.status(400).json({ error: 'invalid_body' });
      return;
    }
    if (!bodyText || !isPayloadWithinLimit(bodyText)) {
      res.status(413).json({ error: 'payload_too_large' });
      return;
    }
    try {
      await put(pathname, bodyText, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('household PUT failed', err && err.stack || err);
      res.status(502).json({ error: 'storage_error' });
    }
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
}
