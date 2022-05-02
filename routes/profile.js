var express = require('express');
var router = express.Router();
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;

router.get('/:id?',(req,res)=> {
    var id = req.params.id;
    console.log(id);
    if(!id){
        id=req.session.userid;
    }
    if(req.session.auth){

        sessioDetails={
            'image':req.session.profileUrl,
            'name':req.session.name,
            'type':req.session.type,
            'id':req.session.userid
        };

        var personDetails = new Promise((resolve,reject)=>{
            dbo.collection("registerdetails").find({_id:ObjectId(id)}).toArray(function(err,result){
                if(err){
                    reject(err);
                } else { 
                    resolve(result);
                }
            });
        })
        var personProjectDetails = new Promise((resolve,reject)=>{
            dbo.collection("projectdetails").find({employee:id}).toArray(function(err,result){
                if(err){
                    reject(err);
                } else { 
                    resolve(result);
                }
            });
        })

        var personTaskDetails = new Promise((resolve,reject)=>{
            dbo.collection("taskDetails").find({"employeedetails._id":ObjectId(id)}).toArray((err,result)=>{
                if(err){
                    reject(err);
                }
                resolve(result);
            })
        })
       
        var loginRequestCount = new Promise((resolve,reject)=>{
            resolve(dbo.collection('registerdetails').find({'approvedbymanager':false}).count())
        });
        Promise.allSettled([personDetails,personProjectDetails,personTaskDetails,loginRequestCount]).then(allDetailsofPerson =>{
            console.log(allDetailsofPerson[0].value,'alll');
            res.render('profile',{'sessionDetails':sessioDetails,'personDetails':allDetailsofPerson[0].value,'personProjectDetails':allDetailsofPerson[1].value,'personTaskDetails':allDetailsofPerson[2].value,'loginCount':allDetailsofPerson[3].value})
        })
    }else{
        alert("Please Login");
        res.redirect('/login');
    
    }
})

router.post('/update',(req,res)=>{
    var image=req.session.profileUrl;
    if(req.body.profileimage){
        image = req.body.profileimagel;
    }
    dbo.collection('taskDetails').updateMany({"employeedetails._id":ObjectId(req.session.userid)},{$set:{"employeedetails.profileimage":req.body.profileimage}})
    dbo.collection('registerdetails').updateOne({_id:ObjectId(req.session.userid)},
    {$set:{profileimage:req.body.profileimage,phonenumber:req.body.phone}},(err,result)=>{
        req.session.profileUrl = req.body.profileimage;
        res.redirect('/profile');
    })
})

// router.use(sessionvalue);
module.exports = router;
