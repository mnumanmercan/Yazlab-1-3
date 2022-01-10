const express = require('express');
const http = require('http');
const mysql = require('mysql');
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);


app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'./public')));



const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Mnm.108778",
    database:"nodejs"
});
con.connect((err) => {
    if(err) throw err;
    console.log("Veri tabani ile baglanti basarili...");
})


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});
app.get('/admin',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/admin.html'));
});

app.get('/user',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/user.html'));
});
app.get('/aLogin',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/aLogin.html'));
});
app.get('/uLogin',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/uLogin.html'));
});

app.post("/admin",async(req,res) =>{
    try{
        var name = req.body.adminname;
        var password = req.body.aPassword;
        
        con.query("SELECT * FROM loginadmin WHERE admin_name = ? and admin_pass = ?",[name,password],(err,results,fields)=>{
            if(results.length > 0){
                con.query("SELECT user_name FROM loginuser",(err,results,fields)=>{
                    console.log(results);
                });
                console.log(`${name} ,admin olarak giris yaptiniz`);
                res.redirect("/aLogin");
                //res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${name}</h3></div><br><br><div align='center'><a href='./admin.html'>logout</a></div>`)
            }
            else{
                res.redirect("/admin");
                console.log("Bu bilgide admin yok");
            }
        })
    }catch{
        res.send("Sunucu hatasi");
    }
    
});

app.post('/aLogin',async(req,res) =>{
    try{
        var name = req.body.username;
        var password = req.body.password;
        
        console.log("-----"+req.params);
        con.query(`INSERT INTO loginuser (user_name,user_pass) VALUES ('${name}','${password}')`,(err,results)=>{
            if(err) throw err;
            console.log(name + " adinda kullanici eklendi");
        });
        res.redirect("/aLogin");
        
    }catch{
        res.redirect("/aLogin");
        console.log("Bu bilgide eleman var");
    }

    /*try{
        var name = req.body.username;
        var password = req.body.password;
        
        console.log("-----"+req.params);
        con.query(`DELETE FROM loginuser (user_name,user_pass) VALUES ('${name}','${password}')`,(err,results)=>{
            if(err) throw err;
            console.log(name + " adinda kullanici silindi");
        });
        res.redirect("/aLogin");
        
    }catch{
        res.redirect("/aLogin");
        console.log("Zaten bu bilgide kullanici kulunmadi");
    } */
});

app.post("/user",async(req,res)=>{
    try{
        var name = req.body.username;
        var password = req.body.uPassword;
        con.query("SELECT * FROM loginuser WHERE user_name = ? and user_pass = ?",[name,password],(err,results,fields)=>{
            if(results.length > 0){
                console.log("")
                res.redirect("/uLogin");
                console.log(`${name} ,kullanici olarak giris yaptiniz`);
                //res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${name}</h3></div><br><br><div align='center'><a href='./user.html'>logout</a></div>`)
            
            }else{
                res.redirect("/user");
                console.log("Bu bilgide kullanici yok");
            }
        })
    }catch{
        res.send("Sunucu hatasi");
    }
});


server.listen(3000,()=>{
    console.log("server is listening on port: 3000");
});