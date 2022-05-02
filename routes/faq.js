var express = require('express');
const { Double } = require('mongodb');
var router = express.Router();
var sessioDetails;
var mongodbutil = require( '../mongodutil' );

var dbo = mongodbutil.getDb();

var ObjectId = mongodbutil.ObjectId;
var alert = require('alert'); 





router.get('/',(req,res)=>{
    var id = req.params.id;
    sessioDetails={
        'image':req.session.profileUrl,
        'name':req.session.name,
        'type':req.session.type,
        'id':req.session.userid
    };
    if(req.session.auth){
            res.render('faq',{'sessionDetails':sessioDetails});
    
       
    }
    

})
module.exports=router;
