import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connect = () => {
    mongoose.connect(process.env.BASE_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    ).catch((err) => console.log(err));
  }
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error", err);
  });
 
  export default connect;