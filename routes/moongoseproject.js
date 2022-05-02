const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    projectname:{
        type:String,
        required:true,
        uppercase:true
    },
    employee:{
        type:Array,
        required:true,
        validate:{validator: v=> v.length>1,message:"atleast you should add 2 members"}
    }

})

module.exports= mongoose.model("ProjectDetails",projectSchema)