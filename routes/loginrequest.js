var express = require('express');

var router = express.Router();
var sessionDetails;
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;
var alert = require('alert'); 

router.get('/',async (req,res)=>{
try{
    if(req.session.auth){
        sessionDetails={
            'image':req.session.profileUrl,
            'name':req.session.name,
            'type':req.session.type,
            'id':req.session.userid
        };
       
        var loginrequestData = new Promise((resolve,reject)=>{
            dbo.collection("registerdetails").find({"approvedbymanager":false}).toArray((err,res)=>{
                if(err){
                    reject(err);
                }
                resolve(res);
            })
        })
        var loginRequestCount = new Promise((resolve,reject)=>{
            resolve(dbo.collection('registerdetails').find({'approvedbymanager':false}).count())
         })
       await  Promise.allSettled([loginrequestData,loginRequestCount]).then(allloginDetails => {
            
            res.render('loginrequest',{'sessionDetails':sessionDetails,'loginrequestdata':allloginDetails[0].value,'loginCount':allloginDetails[1].value})
        })
    }else{
        alert("please login");
        res.redirect("/login");
    }
}
catch(err){
console.log(err);
}
})
router.get('/:id',async (req,res)=>{
    try{
        var id=req.params,id;
         await dbo.collection("registerdetails").updateOne({_id:ObjectId(id)},{$set:{'approvedbymanager':true}});
         res.redirect('/loginrequest');
    }catch(err){
        console.log(err);
    }
})
router.get('/decline/:id',async (req,res)=>{
    try{
        var id=req.params,id;
        await dbo.collection("registerdetails").deleteOne({_id:ObjectId(id)});
        res.redirect('/loginrequest');
    }catch(err){
        console.log(err);
    }
})
module.exports=router;