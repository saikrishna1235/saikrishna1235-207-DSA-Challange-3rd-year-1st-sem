import 'dotenv/config';import express from 'express';import mongoose from 'mongoose';import cors from 'cors';import helmet from 'helmet';import cookieParser from 'cookie-parser';import rateLimit from 'express-rate-limit';import auth from './routes/auth.js';import problems from './routes/problems.js';import dashboard from './routes/dashboard.js';
const app=express();app.use(helmet());app.use(express.json({limit:'100kb'}));app.use(cookieParser());app.use(cors({origin:process.env.FRONTEND_ORIGIN,credentials:true}));app.use('/api/auth',rateLimit({windowMs:900000,max:50}),auth);app.use('/api/problems',problems);app.use('/api/dashboard',dashboard);app.get('/api/health',(q,s)=>s.json({ok:true}));
const port=process.env.PORT||10000;mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log('API listening on '+port))).catch(e=>{console.error(e);process.exit(1)});
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "DSA Curriculum API is running"
  });
});