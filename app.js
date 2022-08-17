require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const https = require('https');
const { Console } = require('console');


const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');

})
app.post('/', function (req, res) {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;

    console.log(fname, lname, email);
    console.log(process.env.API_KEY);

    var data = {
        members: [{
            email_address: email,
            status : "subscribed",
           
            merge_fields : {
                FNAME: fname,
                LNAME : lname
            }
        }
        ],
    }
    jsonData = JSON.stringify(data);
    const url = 'https://us14.api.mailchimp.com/3.0/lists/ef66f51dfa'
    const options = {
        method: "POST",
        auth: ""+process.env.API_KEY
    }

    const request = https.request(url,options,function(response){
        response.on("data",function(data){
           console.log(JSON.parse(data));
        })
        response.statusCode === 200 ? res.sendFile(__dirname+"/sucess.html") : res.sendFile(__dirname +"/failure.html");

    })
    request.write(jsonData);
    request.end();
   

    //res.sendFile(__dirname + '/success.html');

})


app.post('/failure',function(req,res){
    res.redirect("/")

})

app.listen(process.env.PORT || 3000, () => console.log('Server started on port 3000'));

//0729315397e6a843adc64f1d38ada72a-us14
//ef66f51dfa