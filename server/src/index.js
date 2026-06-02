import 'dotenv/config';
import express from "express";
import { connectDB } from './db/db.js';
import { app } from './app.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed", err);
})