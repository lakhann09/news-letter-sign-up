require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ entended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {

    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }

            }
        ]
    }
    var jsonData = JSON.stringify(data)

    const url = "https://us10.api.mailchimp.com/3.0/lists/60a385e31d"
    const options = {
        method: "POST",
        auth: process.env.RANDOME_API_KEY
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
          res.sendFile(__dirname+ "/success.html")
        }else{
            res.sendFile(__dirname+ "/failure.html")
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure",(req, res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("server is running on port 3000");
})