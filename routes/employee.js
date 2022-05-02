var express = require('express');

const app = require('../app');
var router = express.Router();
var sessioDetails;
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;
var { v4: uuidv4 } = require('uuid');
var alert = require('alert'); 
var nodemailer = require('nodemailer');

router.get('/',(req,res)=>{
    var id = req.params.id;
    if(req.session.auth) {
       
        sessioDetails={
            'image':req.session.profileUrl,
            'name':req.session.name,
            'type':req.session.type,
            'id':req.session.userid
        };
        var taskDetails = new Promise((resolve,reject)=>{
            dbo.collection("taskDetails").find({"employeedetails._id":ObjectId(sessioDetails.id)}).toArray((err,result)=>{
               
                if(err) {
                    throw(err)
                }
                resolve(result);
            })

        })
        Promise.allSettled([taskDetails]).then(allDetails =>{
            res.render("employee",{"sessionDetails":sessioDetails, "taskDetails":allDetails[0].value});

        })
       

    }
    else{
        alert("Please Login");
        res.redirect('/login');
    }
})


router.post('/taskmodify',(req,res)=>{
    if(req.session.auth){
        var date = new Date();
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
            hours  = ("0" + date.getHours()).slice(-2);
            minutes = ("0" + date.getMinutes()).slice(-2);
            startdate=[ day, mnth, date.getFullYear()].join("-");
        console.log(req.body,startdate);
        dbo.collection("taskDetails").updateOne(
            { _id:  ObjectId(req.body.taskid) },
            { $set: { "taskDetails.status" : req.body.status,'taskDetails.enddate' : startdate } } , (err,result)=>{
                res.redirect('/employee')
            }
        )
    }

     else{
        alert("Please Login");
        res.redirect('/login');
    }
     
})

router.post('/requesttomanager',(req,res) => {
    if(req.session.auth){
        // var notifactiontouser = {'employeeid':ObjectId(req.session.userid), 'username' :req.session.name,  'msgtouser':'Requested for task'};
        // var notificationtomanager = {'username' :req.session.name,'msgtomanager':"I don't have any task to do",'notificationtype':'manager'};

        // dbo.collection("notificationDetails").insertOne(notifactiontouser,(err,result)=>{
        //     dbo.collection("notificationDetails").insertOne(notificationtomanager,(err,result)=>{
        //     res.redirect('/employee');
        //     })
        // }) 
        alert("Request sent to the manager please wait");

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            tls: { rejectUnauthorized: false },

            auth: {
               user: 'testingnodejs1345@gmail.com',
               pass: 'Testing@123'
            }
            });
         
            var mailOptions = {
            from: 'devil@gmail.com',
            to: 'botchatulasi1356@gmail.com',
            subject: 'Welcome to our app',
            text: '12345',
              html: ` ${req.session.name} requested for task!`,
            };
          

            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
               console.log(error);
           } else {
               console.log('Email sent: ' + info.response);
                res.redirect('/employee')
            }
            });


    }else{
        alert("Please Login");
        res.redirect('/login');

    }
})

module.exports = router;