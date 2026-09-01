import express from 'express';

import authRouter from './modules/auth/routes/auth.routes.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter)

app.get("/", (req, res)=>{
    res.status(200).json("Server is running ")
})

export  default app;