var express = require('express');

const app = require('../app');
var router = express.Router();
var sessioDetails;
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;
var { v4: uuidv4 } = require('uuid');
var alert = require('alert'); 

var msg='';
router.get('/', (req,res)=>{
    var id = req.params.id;
    if(req.session.auth) {
       
        sessioDetails={
            'image':req.session.profileUrl,
            'name':req.session.name,
            'type':req.session.type,
            'id':req.session.userid
        };
        var departmentDetails = new Promise((resolve,reject)=>{
            dbo.collection("registerdetails").find({'type':'employee'}).toArray(function(err,result){
                if(err){
                    reject(err);
                } else {
                    departmentSet=new Set();
                    for(let i=0;i<result.length;i++) {
                        let role=result[i].role.toLowerCase();
                            departmentSet.add(role);
                        
                    }

                    resolve(departmentSet);
                }
            })

        })


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
            dbo.collection('projectdetails').find({}).toArray(function(err,result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })

        
        var loginRequestCount = new Promise((resolve,reject)=>{
            resolve(dbo.collection('registerdetails').find({'approvedbymanager':false}).count())
          })
        Promise.allSettled([departmentDetails,employeeDetails,projectDetails,loginRequestCount]).then(allemployeeDetails => {
            
            res.render('manager',{'sessionDetails':sessioDetails, 'departmentDetails':allemployeeDetails[0].value,'employeeDetails':allemployeeDetails[1].value , 'projectDetails':allemployeeDetails[2].value,'loginCount':allemployeeDetails[3].value,'msg':msg});

        })
    }else{
        alert("Please Login");
        res.redirect('/login');
    
    }

})
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/projectManagement")
var ProjectDetails = require('./moongoseproject');
const { captureRejections } = require('connect-mongo');

router.post('/newProject',(req,res) => {
    if(req.session.auth){

            msg=='';
            run();
            async function run(){
                try{
                    const project = await ProjectDetails.create({projectname:req.body.projectname,employee:req.body.employee});
                    console.log('project',project);
                    msg=''
                    res.redirect('/projectDetails')
                } catch(e){
                    if(e.message=='ProjectDetails validation failed: employee: atleast you should add 2 members'){  
                        msg='atleast you should add 2 employees';
                        res.redirect('/manager');
                    }
                }

            }

    }
    
})



module.exports=router;