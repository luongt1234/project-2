const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/Auth');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//routes
app.use("/v1/auth", authRoute);

const port = process.env.PORT || 3000;
const hostName = process.env.HOSTNAME || 'localhost';


app.listen(port, hostName, () => {
    console.log(`Server is running on http://localhost:${port}`);
});