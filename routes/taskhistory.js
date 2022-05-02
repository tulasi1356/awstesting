var express = require('express');

const app = require('../app');
var router = express.Router();
var sessioDetails;
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;
var { v4: uuidv4 } = require('uuid');
const { route } = require('./login');
var alert = require('alert'); 



router.get('/',async(req,res)=>{
    
    sessionDetails={
        'image':req.session.profileUrl,
        'name':req.session.name,
        'type':req.session.type,
        'id':req.session.userid
    };
    if(req.session.auth) {
        
        var taskDetails = new Promise((resolve,reject) => {
            dbo.collection("taskDetails").find({"employeedetails._id":ObjectId(req.session.userid)}).toArray((err,result)=>{
                if(err){
                    reject(err);
                } resolve(result)
            })
        })
       await Promise.allSettled([taskDetails]).then(taskhistoryandNotification=>{
            res.render('taskhistory',{'sessionDetails':sessionDetails,'taskArray':taskhistoryandNotification[0].value});
        })
    } else {
        alert("Please Login");
        res.redirect("/login");
    }
})





module.exports = router;