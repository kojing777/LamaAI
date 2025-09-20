import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();


//Database

await connectDB();

//middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/', (req, res) => {
  res.send('Hello from Backend !!');
});

//Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});