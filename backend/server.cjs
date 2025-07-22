const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.cjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
