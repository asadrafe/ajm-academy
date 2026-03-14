// api/data.js
// Handles all data operations using Vercel KV (key-value store)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Lazy-load KV only when needed
  const { kv } = await import('@vercel/kv');

  try {
    const { action } = req.method === 'GET' ? req.query : req.body;
    const body = req.method === 'POST' ? req.body : {};

    // ── READ ALL ──────────────────────────────────────────
    if (action === 'loadAll') {
      const [students, invoices, settings] = await Promise.all([
        kv.get('students') || [],
        kv.get('invoices') || [],
        kv.get('settings') || {},
      ]);
      return res.json({
        ok: true,
        students: students || [],
        invoices: invoices || [],
        settings: settings || {},
      });
    }

    // ── STUDENTS ──────────────────────────────────────────
    if (action === 'saveStudents') {
      await kv.set('students', body.students);
      return res.json({ ok: true });
    }

    // ── INVOICES ──────────────────────────────────────────
    if (action === 'saveInvoices') {
      await kv.set('invoices', body.invoices);
      return res.json({ ok: true });
    }

    // ── SETTINGS ─────────────────────────────────────────
    if (action === 'saveSettings') {
      await kv.set('settings', body.settings);
      return res.json({ ok: true });
    }

    return res.status(400).json({ ok: false, error: 'Unknown action' });

  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
