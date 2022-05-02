var express = require('express');


var router = express.Router();
var sessioDetails;
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;


router.get('/delete/:id?', async(req,res)=> {
        var id=req.params.id;
        await dbo.collection("projectdetails").deleteOne({_id:ObjectId(id)});
        await  dbo.collection("taskDetails").deleteMany({"taskDetails.projectid":id});
        res.redirect('/projectDetails');

   
    
})
router.get('/:id?',(req,res)=> {
    var id = req.params.id;

    if(req.session.auth) {
        
        sessioDetails={
            'image':req.session.profileUrl,
            'name':req.session.name,
            'type':req.session.type,
            'id':req.session.userid
        };
        var employeeDetails = new Promise((resolve,reject)=>{
            dbo.collection("registerdetails").find({$and : [{type:'employee'}, {approvedbymanager:true}]}).toArray(function(err,result){
                if(err){
                    reject(err);
                } else { 
                    resolve(result);
                }
            });
        })

       var projectDetails = new Promise((resolve,reject)=> {
           if(req.session.type=='manager') {
                dbo.collection('projectdetails').find().toArray(function(err,result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
           } else {

                dbo.collection('projectdetails').find({employee:req.session.userid}).toArray(function(err,result){
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
           }
            
        })
        
        var loginRequestCount = new Promise((resolve,reject)=>{
            resolve(dbo.collection('registerdetails').find({'approvedbymanager':false}).count())
          })
        Promise.allSettled([employeeDetails,projectDetails,loginRequestCount]).then(allemployeeDetails => {
            res.render('project',{'sessionDetails':sessioDetails,'employeeDetails':allemployeeDetails[0].value , 'projectDetails':allemployeeDetails[1].value,'loginCount':allemployeeDetails[2].value});

        })
    }
})
router.post('/addemployee',(req,res)=>{
    dbo.collection('projectdetails').updateOne({_id:ObjectId(req.body.projectid)},{$push:{'employee':req.body.employeeid}},(err,result)=>{
        res.redirect('/projectDetails');
    });
    
})

router.get('/:projectid/:employeeid',(req,res) => {
    var projectid = req.params.projectid;
    var employeeid = req.params.employeeid;
    sessioDetails={
        'image':req.session.profileUrl,
        'name':req.session.name,
        'type':req.session.type,
        'id':req.session.userid
    };
    async function fetchData(){
        var projectinfo = await dbo.collection("projectdetails").findOne({"_id":ObjectId(projectid)});
        var employeeinfo = await dbo.collection("registerdetails").findOne({"_id":ObjectId(employeeid)});
        var loginCount = await dbo.collection("registerdetails").find({'approvedbymanager':false}).count();
        res.render('taskform',{"projectemployeeid":req.params,"sessionDetails":sessioDetails,'projectinfo':projectinfo,'employeeinfo':employeeinfo,"loginCount":loginCount});

    }
    if(req.session.auth){
            fetchData()
    }
   

})
module.exports = router;