import mongoose from "mongoose";

export function connectDB(){
mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db connected successfully");
    
}).catch((err)=>{
    console.log("fail to connect to DB",err.message);
    
})
}
