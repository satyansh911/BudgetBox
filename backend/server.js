const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ❌ Not needed on Railway if env vars are set there
// require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

/* ---------- CORS SETUP ---------- */

const allowedOrigins = [
  'https://budgetbox-beta.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like curl, Postman, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

/* ---------- DATABASE SETUP ---------- */

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined');
}
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Supabase
  },
});

/* ---------- AUTH MIDDLEWARE ---------- */

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

/* ---------- DB INIT ---------- */

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        month VARCHAR(7) NOT NULL,
        income DECIMAL(10, 2) DEFAULT 0,
        monthly_bills DECIMAL(10, 2) DEFAULT 0,
        food DECIMAL(10, 2) DEFAULT 0,
        transport DECIMAL(10, 2) DEFAULT 0,
        subscriptions DECIMAL(10, 2) DEFAULT 0,
        miscellaneous DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, month)
      );
    `);

    const hashedPassword = await bcrypt.hash('HireMe@2025!', 10);
    await pool.query(
      `
      INSERT INTO users (email, password_hash, name)
      VALUES ('hire-me@anshumat.org', $1, 'Demo User')
      ON CONFLICT (email) DO NOTHING;
    `,
      [hashedPassword]
    );

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

/* ---------- ROUTES ---------- */

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/budget/sync', authenticateToken, async (req, res) => {
  try {
    const budget = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `
      INSERT INTO budgets (
        user_id, month, income, monthly_bills, food, transport, 
        subscriptions, miscellaneous, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, month)
      DO UPDATE SET
        income = $3,
        monthly_bills = $4,
        food = $5,
        transport = $6,
        subscriptions = $7,
        miscellaneous = $8,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `,
      [
        userId,
        budget.month,
        budget.income,
        budget.monthlyBills,
        budget.food,
        budget.transport,
        budget.subscriptions,
        budget.miscellaneous,
      ]
    );

    res.json({
      success: true,
      timestamp: result.rows[0].updated_at,
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.get('/api/budget/latest', authenticateToken, async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM budgets WHERE user_id = $1 AND month = $2',
      [userId, month]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const budget = result.rows[0];
    res.json({
      userId: budget.user_id,
      month: budget.month,
      income: parseFloat(budget.income),
      monthlyBills: parseFloat(budget.monthly_bills),
      food: parseFloat(budget.food),
      transport: parseFloat(budget.transport),
      subscriptions: parseFloat(budget.subscriptions),
      miscellaneous: parseFloat(budget.miscellaneous),
      createdAt: budget.created_at,
      updatedAt: budget.updated_at,
      syncStatus: 'synced',
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Simple health endpoint (no DB)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* ---------- START SERVER ---------- */

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  initDatabase();
});
