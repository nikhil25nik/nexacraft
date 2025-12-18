import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import RouteAuth from "./routes/auth.routes.js";
import AiRouter from "./routes/ai.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import ActivityRoute from "./routes/activity.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 3000;

await connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL, 
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

//routes

app.use("/api/auth",RouteAuth);
app.use("/api/ai",AiRouter);
app.use("/api/activity",ActivityRoute);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch(console.error);


// app.get("/",(req,res)=>{
//     res.send("this is simple route")
// })

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.use((err,req ,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
    
})