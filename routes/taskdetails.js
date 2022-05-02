var express = require('express');


var router = express.Router();

var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;

var alert = require('alert'); 



router.post('/', (req,res) => {
        if(req.session.auth){
            var ProjectDetails = new Promise((resolve,reject) => {
                dbo.collection('projectdetails').findOne({_id:ObjectId(req.body.projectid)},(err,result) => {
                    if(err){
                        reject(err);
                    }
                    resolve(result);
                })
            })
            var employeeDetails = new Promise((resolve,reject) => {
                dbo.collection('registerdetails').findOne({_id:ObjectId(req.body.employeeid)},(err,result) => {
                    if(err){
                        reject(err);
                    }
                    resolve(result);
                })
            })

        
            Promise.allSettled([ProjectDetails,employeeDetails]).then(allemployeeDetails => {
                // console.log(allemployeeDetails);
                var obj={'projectname':allemployeeDetails[0].value.projectname,'employeedetails': allemployeeDetails[1].value, 'taskDetails':req.body} 
                dbo.collection("taskDetails").insertOne(obj);
                res.redirect('/taskdetails/info');
            })
        } else{
            alert("Please Login");
            res.redirect("/login");
        }
    

})

router.get('/info', (req,res)=>{
    var id = req.params.id;

    sessionDetails={
        'image':req.session.profileUrl,
        'name':req.session.name,
        'type':req.session.type,
        'id':req.session.userid
    };
    if(req.session.auth) {
       
        var taskDeatils  = new Promise((resolve,reject)=>{
            dbo.collection('taskDetails').find({}).toArray((err,result) => {
                if(err){
                    reject(err)
                } else{
                    resolve(result);
                }
            })
    
        })
        var loginRequestCount = new Promise((resolve,reject)=>{
            resolve(dbo.collection('registerdetails').find({'approvedbymanager':false}).count())

          })
        Promise.allSettled([taskDeatils,loginRequestCount]).then(taskdetailsandNotification=>{
            res.render('taskdetails',{'sessionDetails':sessionDetails, 'taskArray':taskdetailsandNotification[0].value,'loginCount':taskdetailsandNotification[1].value});
        })
    } else {
        alert("Please Login");
        res.redirect("/login");
    }
})

module.exports = router;