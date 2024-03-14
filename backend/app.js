import express from "express" ;
import mongoose, { mongo } from "mongoose" ;
import DefaultData from "./defaultData.js" ;
import cors from "cors" ;
import router from "./routes/router.js";
import cookieParser from "cookie-parser";


const DB = "mongodb+srv://akshaybabel0611:Password%40123@cluster0.tvcwv2v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = express();


app.use(express.json());
app.use(cookieParser(""));
app.use(cors());
app.use(router);

mongoose.connect(DB).then(()=>console.log("connected"));

const port = 3000; 

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});

// DefaultData();


