import express,{json} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use((req,res,next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//body parsing
app.use(express.json({limit: "16kb"})); // express.json() → parses JSON body and payload limit is 16kb
app.use(express.urlencoded({limit: "16kb"})); // express.urlencoded() → parses form data 


app.use(express.static("public")); // serves static files like image
app.use(cookieParser()); // parses cookies data


export {app};