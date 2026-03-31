const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const certRoutes = require('./routes/certRoutes');
const verifyRoutes = require('./routes/verifyRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/certificates', certRoutes);
app.use('/api/verify', verifyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('MongoDB MOCK (Local Runtime) Active due to lack of local database.');
  console.log(`Server is running on port ${PORT}`);
});
