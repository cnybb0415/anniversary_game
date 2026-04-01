// Vercel 서버리스 함수 — Supabase REST API 사용
export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({ error: 'Supabase env not configured' });
  }

  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  };

  const action = req.query.action;

  try {
    if (action === 'load') {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/scores?select=character,score&order=score.desc`,
        { headers }
      );
      const data = await response.json();
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(data);

    } else if (action === 'save') {
      const { character, score, datetime } = req.query;
      const response = await fetch(
        `${supabaseUrl}/rest/v1/scores`,
        {
          method: 'POST',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ character, score: parseInt(score), datetime }),
        }
      );
      if (!response.ok) {
        const err = await response.text();
        return res.status(500).json({ error: err });
      }
      return res.status(200).json({ result: 'success' });

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to reach Supabase' });
  }
}
