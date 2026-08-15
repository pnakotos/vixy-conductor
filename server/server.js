import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '0.0.0.0';

const pendingCommands = new Map();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Interconnection-Key');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'vixy', timestamp: new Date().toISOString() });
});

app.post('/commands', (req, res) => {
  const { appId, command, payload = {} } = req.body || {};

  if (!appId || !command) {
    res.status(400).json({ ok: false, message: 'appId and command are required' });
    return;
  }

  const queue = pendingCommands.get(appId) || [];
  const entry = {
    id: `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    command,
    payload,
    createdAt: new Date().toISOString(),
  };

  pendingCommands.set(appId, [...queue, entry]);

  res.json({ ok: true, message: 'command queued', commandId: entry.id, appId });
});

app.get('/commands/:appId', (req, res) => {
  const queue = pendingCommands.get(req.params.appId) || [];
  const next = queue.shift();

  if (next) {
    pendingCommands.set(req.params.appId, queue);
    res.json({ ok: true, commands: [next] });
    return;
  }

  res.json({ ok: true, commands: [] });
});

app.post('/drivers/sync', (req, res) => {
  res.json({ ok: true, message: 'driver synced', data: req.body });
});

app.post('/payments/verify', (req, res) => {
  res.json({ ok: true, message: 'payment verified', data: req.body });
});

app.post('/trips/ledger', (req, res) => {
  res.json({ ok: true, message: 'trip ledger accepted', data: req.body });
});

app.listen(PORT, HOST, () => {
  console.log(`Vixy backend listening on http://${HOST}:${PORT}`);
});
