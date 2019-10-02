var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
var flash = require('connect-flash');
var fs = require('fs');
var path = require('path')
var Canvas = require('canvas')
const PDFDocument = require('pdfkit');
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

router.post('/downloadImage', async function(req, res)
{
  var text = req.body.text;
  var textColor = req.body.textColor;
  var bgColor = req.body.bgColor;
  var size = req.body.size;
  if(text)
  {  
    Canvas.registerFont('./Sharada.ttf', {family: 'Sharada'})
    var writeStream = fs.createWriteStream('./image.jpg');
    var canvas = Canvas.createCanvas(1000, 1000)
    var ctx = canvas.getContext('2d')
  
    var Image = Canvas.Image;
    var img = new Image();
    img.src = './layout-'+bgColor+'.jpg';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    
    ctx.font = size+' Sharada'
    ctx.fillText(text, 500, 500)
    canvas.createJPEGStream().pipe(writeStream);
    writeStream.on('finish', function () {
      res.download('./image.jpg', 'image.jpg');
    });
  }
  else
  {
    res.render('home', {msg: 'Please type some text!'});
  }
  

});
router.post('/downloadPDF', async function(req, res)
{
  
  var text = req.body.text;
  if(text)
  { 
      // Create a document
      const doc = new PDFDocument();
      
      // Pipe its output somewhere, like to a file or HTTP response
      // See below for browser usage
     var stream = doc.pipe(fs.createWriteStream('document.pdf'));
      
      // Embed a font, set the font size, and render some text
      doc.font('./Sharada.ttf')
        .fontSize(20)
        .text(text, 20, 20);
        doc.end();
        stream.on('finish', function() {
          res.download('./document.pdf', 'document.pdf');
        });
  }

  else
  {
    res.render('home', {msg: 'Please type some text!'});
  }
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
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: "instassistofficial@gmail.com", // generated ethereal user
          pass: "Inst@ssIst22" // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
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