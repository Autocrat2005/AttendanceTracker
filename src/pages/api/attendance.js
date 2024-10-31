import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, date, status } = req.body;
    await kv.hset(`user:${userId}`, { [date]: status });
    res.status(200).json({ message: 'Attendance recorded' });
  } else if (req.method === 'GET') {
    const { userId } = req.query;
    const attendance = await kv.hgetall(`user:${userId}`);
    res.status(200).json(attendance);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}