const mongoose = require('mongoose');

//exporting the datbase conncetivity
exports.connectionDB = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECTION,
    { useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true },(err, data)=>{
      
        if(err){ 
          console.log("Unable to connect with DB", err);
        }
        else{
          console.log("DB Connected")
        }
    })
   
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
