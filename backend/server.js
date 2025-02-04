import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './src/databases/mongodb.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT ;

console.log("Allowed frontend url", process.env.CLIENT_URL) ;

const allowedOrigins = [
  process.env.CLIENT_URL, // Your Vercel URL
  "http://localhost:5173" // For local testing (optional)
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
      // Allow requests with no origin (Postman/curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: Origin not allowed"));
      }
  },
  credentials: true,
  methods: "GET,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()) ;



// Database connection
connectDB() ;

// Routes
import authRoutes from './src/routes/user.route.js';
import noteRoutes from './src/routes/note.route.js';
import { errorHandler } from './src/middlewares/error.middleware.js';
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/notes', noteRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});