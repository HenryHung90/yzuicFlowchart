import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export default mongoose.connect(process.env.MONGODB_LINK,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})