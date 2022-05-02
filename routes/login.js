var express = require('express');
var router = express.Router();
var dbo;
var alert = require('alert');
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;

const bcrypt = require('bcrypt');
const saltRounds = 10;
router.get('/',(req,res)=>{
    if(!req.session.auth){
      res.render('login',{"msg":''});
    }
    else {
      if(req.session.type=='manager'){
        res.redirect('/dashboard');
      } else {
        res.redirect('/dashboard')
      }
    }
})
router.post('/validate', (req,res) => {
 
  if(!req.session.auth){
  
    if(req.body.email.length==0 && req.body.password.length==0){
      
      res.json({error:true,'msg':'both are not mentioned'})
    } else {
    dbo.collection("registerdetails").findOne({email:req.body.email},function(err,result){
      
      if(result) {
        if(result.verify){
          if(result.approvedbymanager==false){
              alert("please ask your manager to accept the request");
              res.redirect('/login');
          } 
           else if(result.email == req.body.email &&  bcrypt.compareSync(req.body.password,result.password)) {
              req.session.name=result.name;
              req.session.auth = true;
              req.session.userid = result._id;
              req.session.type=result.type;
              req.session.profileUrl=result.profileimage;
              alert("Sucessfully login");
               res.json({success:true});
              
            }
             else {
              if(!bcrypt.compareSync(req.body.password,result.password)){
                 res.json({error:true,'msg':'Wrong Password'});
              }
              // res.render('login',{"msg":"wrong credentials"})
            }
        } 
        else {
          res.json({error:true,'msg':'Your account is not verified'})
          // res.render('verify',{'id1':result._id,layout:false});
          
        }
      }

      else {
        res.json({error:true,'msg':"Account doesn't exit please"});
      }
    })
  }
  } 
   
})
module.exports = router;