import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const LIMITS = { name: 100, email: 200, phone: 40, subject: 60, message: 5000 };
const SUBJECTS = {
  general: 'General inquiry / استفسار عام',
  products: 'Product inquiry / استفسار عن منتج',
  offers: 'Offer inquiry / استفسار عن عرض',
  partnership: 'Business partnership / شراكة تجارية',
  other: 'Other / أخرى',
};
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 3; // max messages per IP per window
const MIN_FILL_MS = 3000; // humans need > 3s to fill the form

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const db =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

// Best-effort fallback limiter when the database is not configured
const memoryHits = new Map();

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const clean = (v, max) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max) : '';

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

function isAllowedOrigin(origin) {
  if (!origin) return true; // non-browser clients are still rate-limited
  let host;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((o) => {
      try {
        return new URL(o).hostname;
      } catch {
        return o;
      }
    });
  return (
    host === 'moshaltd.com' ||
    host.endsWith('.moshaltd.com') ||
    host.endsWith('.vercel.app') ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    extra.includes(host)
  );
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim();
  return ip || req.socket?.remoteAddress || 'unknown';
}

async function isRateLimited(ipHash) {
  const since = Date.now() - RATE_WINDOW_MS;
  if (db) {
    const { count, error } = await db
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', new Date(since).toISOString());
    if (!error) return (count ?? 0) >= RATE_MAX;
  }
  const hits = (memoryHits.get(ipHash) || []).filter((t) => t > since);
  memoryHits.set(ipHash, hits);
  return hits.length >= RATE_MAX;
}

function rememberHit(ipHash) {
  const hits = memoryHits.get(ipHash) || [];
  hits.push(Date.now());
  memoryHits.set(ipHash, hits);
}

function emailHtml({ name, email, phone, subjectLabel, message }) {
  const row = (label, value) =>
    `<tr><td style="padding:8px 12px;color:#64748b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:8px 12px;color:#0f172a">${value}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
    <div style="background:#0c2f38;color:#fff;padding:20px 24px;font-size:18px;font-weight:bold">New message from moshaltd.com</div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${row('Name', escapeHtml(name))}
      ${row('Email', `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
      ${row('Phone', escapeHtml(phone || '—'))}
      ${row('Subject', escapeHtml(subjectLabel))}
    </table>
    <div style="padding:16px 24px;border-top:1px solid #e2e8f0;font-size:15px;line-height:1.7;color:#0f172a;white-space:pre-wrap" dir="auto">${escapeHtml(message)}</div>
  </div></body></html>`;
}

function confirmationHtml(name) {
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;padding:24px;border:1px solid #e2e8f0;line-height:1.8;color:#0f172a">
    <p dir="rtl" style="text-align:right">مرحباً ${escapeHtml(name)}،<br>شكراً لتواصلك مع شركة موشا للتجارة والاستثمار. استلمنا رسالتك وسيتواصل معك فريقنا قريباً.</p>
    <hr style="border:none;border-top:1px solid #e2e8f0">
    <p>Hello ${escapeHtml(name)},<br>Thank you for contacting Mosha for Trading &amp; Investment. We have received your message and our team will get back to you shortly.</p>
  </div></body></html>`;
}

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAllowedOrigin(req.headers.origin)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const ctype = String(req.headers['content-type'] || '');
  if (!ctype.includes('application/json')) {
    return res.status(415).json({ error: 'unsupported_media_type' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Spam traps: hidden field must be empty, and the form can't be submitted instantly.
  const honeypot = clean(body.website, 200);
  const startedAt = Number(body.startedAt);
  if (honeypot || (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS)) {
    return res.status(200).json({ success: true }); // pretend success so bots don't retry
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email).toLowerCase();
  const phone = clean(body.phone, LIMITS.phone);
  const subject = clean(body.subject, LIMITS.subject);
  const message = clean(body.message, LIMITS.message);

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 5 || !(subject in SUBJECTS)) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  if (phone && !/^[+\d\s()-]{6,40}$/.test(phone)) {
    return res.status(400).json({ error: 'invalid_input' });
  }

  const ipHash = createHash('sha256')
    .update(clientIp(req) + (process.env.SUPABASE_SERVICE_ROLE_KEY || 'mosha'))
    .digest('hex')
    .slice(0, 32);

  try {
    if (await isRateLimited(ipHash)) {
      return res.status(429).json({ error: 'too_many_requests' });
    }
  } catch (e) {
    console.error('rate-limit check failed', e);
  }
  rememberHit(ipHash);

  // 1) Save a copy in the database (so no message is ever lost)
  let saved = false;
  if (db) {
    const { error } = await db.from('messages').insert({ name, email, phone, subject, message, ip_hash: ipHash });
    if (error) console.error('DB insert failed:', error.message);
    else saved = true;
  }

  // 2) Email the team
  let emailed = false;
  if (resend) {
    const subjectLabel = SUBJECTS[subject];
    const to = (process.env.CONTACT_TO || 'mostafashawgi@gmail.com')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const verifiedFrom = process.env.RESEND_FROM;
    try {
      const { error } = await resend.emails.send({
        from: verifiedFrom || 'Mosha Website <onboarding@resend.dev>',
        to,
        replyTo: email,
        subject: `New message: ${subjectLabel} — ${name}`.slice(0, 200),
        html: emailHtml({ name, email, phone, subjectLabel, message }),
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nSubject: ${subjectLabel}\n\n${message}`,
      });
      if (error) console.error('Resend error:', error);
      else emailed = true;

      // Confirmation to the customer — only possible once the domain is verified in Resend
      if (verifiedFrom && emailed) {
        await resend.emails
          .send({
            from: verifiedFrom,
            to: [email],
            subject: 'We received your message — تم استلام رسالتك | Mosha',
            html: confirmationHtml(name),
          })
          .catch((e) => console.error('confirmation failed', e));
      }
    } catch (e) {
      console.error('Resend exception:', e);
    }
  }

  if (!saved && !emailed) {
    return res.status(502).json({ error: 'delivery_failed' });
  }
  return res.status(200).json({ success: true });
}
