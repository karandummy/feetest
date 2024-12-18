const mongoose = require('mongoose')
const Studschema =  new mongoose.Schema({
    RegNo:mongoose.Schema.Types.Int32,
    Name: String,
    Degree:String,
    Branch:String,
    Semester:mongoose.Schema.Types.Int32,
    Batchyear:mongoose.Schema.Types.Int32,
    DOB:String,
    photo:String,
    Accommodation:String,
    Enrollment:String,
    Fees:{
        type: Object, 
        default: {
            BusFee:mongoose.Schema.Types.Double,
            ExamFee:mongoose.Schema.Types.Double,
            HostelFee:mongoose.Schema.Types.Double,
            TuitionFee:mongoose.Schema.Types.Double
        },
    }

})

const StudModel = mongoose.model("studs",Studschema)
module.exports=StudModel