var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
var flash = require('connect-flash');

// Get Homepage
router.get('/', function(req, res)
{
	res.render('home', {title: 'Write Sharada'});
});
router.get('/report', function(req, res)
{
	res.render('report', {title: 'Feedback/Report'});
});
router.get('/contact', function(req, res)
{
	res.render('contact', {title: 'Contact'});
});

router.post('/report', async function(req, res)
{
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;  
    var subject = req.body.subject;
    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').notEmpty();
    req.checkBody('email', 'Email is not valid!').isEmail();
    req.checkBody('subject', 'Name is required!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
            console.log(errors);
        res.render('report', {
            errors: errors
        });
    }
    else 
    {

        let transporter = nodemailer.createTransport({
           service: 'gmail',
            auth: {
              user: "instassistofficial@gmail.com", // generated ethereal user
              pass: "Inst@ssIst22" // generated ethereal password
            }
          });

          let info = await transporter.sendMail({
            from: email, // sender address
            to: "shuhulkaul22@gmail.com", // list of receivers
            subject: "Write Sharada Report: "+subject+" from: "+name +" ("+email+")", // Subject line
            text:"Report Message: " + message, // plain text body
            
          }, function(error, info){
			
			if (error) {
		
                console.log("ERROR :"+ error);	
                res.render('report',{
                    error:error 
                });
					
			} else {
				
				console.log("INFO RESPONSE:" + info.response);
                console.log("Message sent: %s", info.messageId);        
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                var message = "success";
                res.render('report',{
                     message: message
                });
			}
		});
    }
});

module.exports = router;