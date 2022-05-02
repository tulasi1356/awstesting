var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;
var dbo;
const bcrypt = require('bcrypt');
const saltRounds = 10;
var alert=require('alert');

router.get('/',(req,res)=>{
    res.render('home')
})

router.get('/register', (req,res)=> {
    res.render('register',{'msg':''})
})

router.post('/registervalidate', async (req,res)=>{
    var val = Math.floor(1000 + Math.random() * 9000);
    await dbo.collection("registerdetails").findOne({email:req.body.email},function(err,result){
        if(req.body.email=='' && req.body.password=='' && req.body.name=='' && req.body.role=='') {
            res.render('register',{"msg":"all"})
        }
        else if(req.body.email==''){
            res.render('register',{"msg":"mailerror"});
        }
       else if(req.body.name=='') {
            res.render('register',{"msg":"nameerror"});

        } else if(req.body.password==''){
            res.render('register',{"msg":"passworderror"});
            
        }else if(req.body.role==''){
            res.render('register',{"msg":"roleerror"});
            
        } else {
            if(result){
                if(!result.verify){
                    res.render('verify',{'id1':result._id});
                } else{
                    res.render('register',{"msg":"alreadymailerr"})
                    

                }
            }
             else {
                console.log(req.body);
                
               bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                 var myobj = {name: req.body.name, email: req.body.email,password: hash ,verify: false , verificationcode : val , type : req.body.type, role: req.body.role, profileimage:req.body.profileimage,approvedbymanager:false};

                dbo.collection("registerdetails").insertOne(myobj,function(err,result){
                    if(err) throw err;
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
                        to: myobj.email,
                        subject: 'Welcome to our app',
                        text: '12345',
                          html: `verification code ${val}!`,
                        };
                        res.render('verify',{'id1':result.insertedId});

                        transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                           console.log(error);
                       } else {
                           
                           console.log('Email sent: ' + info.response);
                            // res.render('verify',{'id1':result.insertedId});
                        }
                        });
        
                })

            });
            }   
        }
        
    })

})

router.post('/registercodevalidate',function(req,res){

    dbo.collection("registerdetails").findOne({_id:ObjectId(req.body.idnum)},function(err,result){
        
        if(req.body.verifycode==result.verificationcode){
            dbo.collection("registerdetails").updateOne({_id:ObjectId(req.body.idnum)},{$set : {verify : true}}, function(err,result2){
                alert("Successfully Registered")
                res.redirect("/login");
            })
        } else {
            // res.render('',{"msg":"enter valid verify code"})
            alert('enter a valid code');
        }
    })

})

module.exports = router;