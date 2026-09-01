import express from 'express';

const app = express();

app.get("/", (req, res)=>{
    res.status(200).json("Server is running ")
})

export  default app;