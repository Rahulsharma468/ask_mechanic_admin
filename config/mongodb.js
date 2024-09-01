const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const URI = process.env.NEXT_PUBLIC_MONGODB_URI;
        await mongoose.connect(URI);
        console.log('Connected To DB')
    }catch(err){
        console.log('Error connecting to DB');
        console.log(err);
    }
}


export default connectDB;