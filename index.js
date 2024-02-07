import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 5000
const corsOptions = {
    origin: true,
    credentials: true
}

const app = express();

mongoose.set('strictQuery', false);
const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGODBURI);
        console.log('MongoDB database connected')
    }catch(err){
        console.log('MongoDb database connection failed')
    }
}

app.use(express.json());
app.use(cors(corsOptions));

app.listen(port, () => {
    connectDb();
    console.log(`app is listening on port ${port}`)
})