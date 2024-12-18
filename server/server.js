const express =require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Fee = require("./models/fees")
const StudModel = require("./models/student")
require('dotenv').config({ path: './.env' });


const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_CNCT_STR);

app.post("/home", (req, res) => {
    const { Reg_No, password } = req.body;
    //console.log("Received request:", req.body);

    if (!Reg_No || !password) {
        return res.status(400).json("Please provide both Reg_No and password");
    }

    StudModel.findOne({ RegNo: Reg_No})
        .then((student) => {
            //console.log("Student found:", student);
            if (student) {
                if (student.DOB == password) {
                    
                    res.status(200).json(student);
                } else {
                    res.status(200).json({message:'The password is incorrect'});
                }
            } else {
                res.status(200).json({message:'Reg No not found'});
            }
            
        })
        .catch((err) => {
            console.error("Error during database query:", err);
            res.status(500).json("Server error");
        });
});


app.get("/pay", (req, res) => {
    const { RegNo } = req.query; // Extract RegNo from URL path
   

    if (!RegNo) {
        return res.status(400).json("Please provide a valid Reg_No");
    }

    // Find student with the provided RegNo
    StudModel.findOne({ RegNo })
    .then((student) => {
        if (student) {
            const filteredFees = {};
            for (const key of Object.keys(student.Fees || {})) {
                filteredFees[key] = student.Fees[key]; // Retain original values
            }
            res.status(200).json({ Fees: filteredFees });
        } else {
            res.status(404).json({ message: "Reg No not found" }); // Student not found
        }
    })
    .catch((err) => {
        console.error("Error during database query:", err);
        res.status(500).json("Server error");
    });
});

app.post('/fees', async (req, res) => {
    try {
        const {  RegNo1 , selectedFees1,totalAmount1,transactionId1,timestamp1 } = req.body;
        const newf=new Fee({
            RegNo:RegNo1,
            selectedFees:selectedFees1,
            totalAmount:totalAmount1 ,
            transactionId:transactionId1,
            timestamp:timestamp1
        })    
    await newf.save();

    const student = await StudModel.findOne({ RegNo: RegNo1 });
    

    const str = selectedFees1;
    const arr = str.split(",");    
    const updateData = {};
    
    arr.forEach((feeKey) => {
            if (student.Fees.hasOwnProperty(feeKey)) {
                updateData[`Fees.${feeKey}`] = null;
            }
        });
        
        if (Object.keys(updateData).length > 0) {
            await StudModel.updateOne({ RegNo: RegNo1 }, { $set: updateData });
            res.status(200).send({ message: 'Fees updated to null successfully' });
        } else {
            res.status(400).send({ message: 'No valid fields to update' });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: 'Error updating fees', error });
    } })
    
  



app.listen(process.env.PORT,()=>{
    console.log("server is running")
})

