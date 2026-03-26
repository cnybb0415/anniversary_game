// Vercel 서버리스 함수 — Apps Script URL을 환경변수로 숨김
export default async function handler(req, res) {
  const scriptUrl = process.env.APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return res.status(503).json({ error: 'APPS_SCRIPT_URL not configured' });
  }

  const params = new URLSearchParams(req.query);
  const action = req.query.action;

  try {
    const response = await fetch(`${scriptUrl}?${params.toString()}`);
    const data = await response.json();

    // load: CDN 30초 캐싱 → 동시 요청 몰려도 함수 1번만 실행
    // save: 캐싱 없음
    if (action === 'load') {
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: 'Failed to reach score server' });
  }
}
