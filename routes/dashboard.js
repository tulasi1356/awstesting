var express = require('express');

const app = require('../app');
var router = express.Router();
var sessioDetails;
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;
var alert = require('alert'); 


router.get('/',(req,res)=>{
    
   
  
      

    sessionDetails={
        'image':req.session.profileUrl,
        'name':req.session.name,
        'type':req.session.type,
        'id':req.session.userid
    };
    var pipeline =[
        {
          '$match': {}
        }, {
          '$group': {
            '_id': '$taskDetails.employeeid', 
            'taskcount': {
              '$sum': 1
            }
          }
        }
      ]

      var pipeline2 =[
        {
          '$match': {}
        }, {
          '$group': {
            '_id': '$taskDetails.status', 
            'taskcount': {
              '$sum': 1
            }
          }
        }
      ]

  
    
    var employeeDetails = new Promise((resolve,reject) => {
        dbo.collection("registerdetails").find({$and:[{'type':'employee'}, {'approvedbymanager':true}]}).toArray((err,result)=>{
            if(err){
                reject(err)
            }
            employeecount=result.length;
            resolve(result);
        })
    })
     var taskdetailsfroGraph= new Promise((resolve,reject)=>{
        dbo.collection("taskDetails").aggregate(pipeline).toArray((err,result)=>{
            if(err) {
                reject(err);         

            }else {
                resolve(result);
            }
        })
     }) 
     var taskStatusDetails = new Promise((resolve,reject)=>{
        dbo.collection("taskDetails").aggregate(pipeline2).toArray((err,result)=>{
            if(err) {
                reject(err);         

            }else {
                resolve(result);
            }
        })
     }) 
     var CountDetails=new Promise((resolve,reject)=>{
        if(req.session.type=="employee") {
          resolve(dbo.collection('projectdetails').find({"employee":req.session.userid}).count())  
           
        } else {
            resolve(dbo.collection('projectdetails').find({}).count())
        }
         
      })  
      var loginRequestCount = new Promise((resolve,reject)=>{
        resolve(dbo.collection('registerdetails').find({'approvedbymanager':false}).count())
      })
      var CounttaskDetails = new Promise((resolve,reject)=>{
        if(req.session.type=='employee'){
            resolve(dbo.collection('taskDetails').find({"employeedetails._id":ObjectId(req.session.userid)}).count());
        } else{
            resolve(dbo.collection('taskDetails').find({}).count());
        }
      })

     Promise.allSettled([taskdetailsfroGraph,employeeDetails,CountDetails,CounttaskDetails,taskStatusDetails,loginRequestCount]).then(alltaskDetails => {
        
         res.render('dashboard',{'sessionDetails':sessionDetails,'graphDetails':alltaskDetails[0].value,'employeeDetails':alltaskDetails[1].value,'projectCount':alltaskDetails[2].value,'taskCount':alltaskDetails[3].value,'taskStatusDetails':alltaskDetails[4].value,'loginCount':alltaskDetails[5].value})
     })


})
module.exports = router;