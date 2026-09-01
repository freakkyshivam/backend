import 'dotenv/config'
import express from 'express';
import session from 'express-session'

import authRouter from './modules/auth/routes/auth.routes.js'

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter)

app.get("/", (req, res)=>{
    res.status(200).json("Server is running ")
})

export  default app;