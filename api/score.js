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
      const { character, score } = req.query;

      // top 20 가져오기
      const topRes = await fetch(
        `${supabaseUrl}/rest/v1/scores?select=character,score&order=score.desc&limit=20`,
        { headers }
      );
      const topData = await topRes.json();

      // 내 등수 계산: 내 점수보다 높은 행 수 + 1
      let myRank = null;
      if (character && score) {
        const rankRes = await fetch(
          `${supabaseUrl}/rest/v1/scores?select=id&score=gt.${score}`,
          { headers: { ...headers, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' } }
        );
        const contentRange = rankRes.headers.get('content-range');
        if (contentRange) {
          const total = parseInt(contentRange.split('/')[1]);
          myRank = isNaN(total) ? null : total + 1;
        }
      }

      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ top: topData, myRank });

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
