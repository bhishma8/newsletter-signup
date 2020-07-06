const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");



const app=express();
app.use(express.static("public"));// to access local files such as css,pictures
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
    var firstName=req.body.fname;
    var lastName=req.body.lname;
    var email=req.body.email;
    var data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:
                {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }

        ]
    }
    const jsonData=JSON.stringify(data);
    const url="https://us10.api.mailchimp.com/3.0/lists/703fe9fc7a";
    const options={
        method:"POST",
        auth:"ishan:b2b14158be6f43dac70dd467b19563e8-us10"
    }
    const request = https.request(url,options,function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname + "/success.html");
        } 
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
    
});

app.post("/failure",function(req,res){
    res.redirect("/");
})



app.listen(process.env.PORT || 3000,function(req,res){
    console.log("The server is running on port 3000");

});
