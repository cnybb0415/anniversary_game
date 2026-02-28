// Vercel 서버리스 함수 — Apps Script URL을 환경변수로 숨김
export default async function handler(req, res) {
  const scriptUrl = process.env.APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return res.status(503).json({ error: 'APPS_SCRIPT_URL not configured' });
  }

  const params = new URLSearchParams(req.query);

  try {
    const response = await fetch(`${scriptUrl}?${params.toString()}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: 'Failed to reach score server' });
  }
}
