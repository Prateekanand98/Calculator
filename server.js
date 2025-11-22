const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'calculator';
const COLLECTION = 'counters';

app.use(express.json());

// Simple CORS for API access if served from different origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

(async function init() {
  let client;
  try {
    client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB at', MONGO_URL);
    const db = client.db(DB_NAME);
    const coll = db.collection(COLLECTION);
    const visitorIds = db.collection('visitor_ids');

    // Ensure document exists for counters and unique index for visitor ids
    await coll.updateOne({ _id: 'visitors' }, { $setOnInsert: { count: 0 } }, { upsert: true });
    try {
      await visitorIds.createIndex({ visitorId: 1 }, { unique: true });
    } catch (idxErr) {
      console.warn('Could not create unique index on visitor_ids.visitorId', idxErr.message || idxErr);
    }

    // API: get current count
    app.get('/api/visitors', async (req, res) => {
      try {
        const doc = await coll.findOne({ _id: 'visitors' });
        res.json({ count: (doc && doc.count) || 0 });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'db_error' });
      }
    });

    // API: increment only for unique visitorId and return new count
    app.post('/api/visitors/increment', async (req, res) => {
      try {
        const visitorId = req.body && req.body.visitorId;

        if (!visitorId) {
          // If no visitorId provided, return current count without incrementing
          const doc = await coll.findOne({ _id: 'visitors' });
          return res.json({ count: (doc && doc.count) || 0, incremented: false, reason: 'no_visitorId' });
        }

        // Try to insert visitorId; if inserted, it's a new unique visitor
        try {
          await visitorIds.insertOne({ visitorId: visitorId, createdAt: new Date() });
          // New visitor — increment counter
          const r = await coll.findOneAndUpdate(
            { _id: 'visitors' },
            { $inc: { count: 1 } },
            { returnDocument: 'after', upsert: true }
          );
          const newDoc = r.value || { count: 0 };
          return res.json({ count: newDoc.count, incremented: true });
        } catch (insErr) {
          // Duplicate key -> visitor already exists
          if (insErr && insErr.code === 11000) {
            const doc = await coll.findOne({ _id: 'visitors' });
            return res.json({ count: (doc && doc.count) || 0, incremented: false });
          }
          // Other insertion error
          console.error('visitorIds.insertOne error', insErr);
          return res.status(500).json({ error: 'db_error' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'db_error' });
      }
    });

    // Serve static files (the SPA)
    app.use(express.static(path.join(__dirname)));

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    if (client) await client.close();
    process.exit(1);
  }
})();
