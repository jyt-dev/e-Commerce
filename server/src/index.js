import 'dotenv/config';
import express from "express";
import { connectDB } from './db/db.js';
import { app } from './app.js';

connectDB()
.then(() => {//.then() runs when the Promise is successfully resolved and it executes it callback arrow function
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on port : ${process.env.PORT}`);
    })
})
.catch((err) => {//"If the Promise is rejected (an error occurs), execute this callback function
    console.log("MongoDB connection failed", err);
})

// Connect to MongoDB.
// If connection succeeds → start the Express server.
// If connection fails → print the error.


//then and catch takes callback functions as arguments 
//A function that is passed as an argument to another function so it can be executed later is callback

//connectDB returns a promise that is consumed using then and catch