// Step 1

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
  
var fs = require('fs');
var path = require('path');


// Step 2

// mongoose.connect(process.env.MONGO_URL,
//     { useNewUrlParser: true, useUnifiedTopology: true }, err => {
//         console.log('connected')
//     });


    mongoose.connect(
        "mongodb+srv://Debojyoti:abcd1234@cluster0.xenlwdv.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true ,
         useUnifiedTopology: true },err =>{
            if(err){
                console.log(err);
            }
            else{
                 console.log('connected')
            }
           
        }
      );


// Step 3:- Create model.js


// Step 4 - set up EJS
  
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  
// Set EJS as templating engine 
app.set("view engine", "ejs");



// Step 5 - set up multer for storing uploaded files
  
var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });





// Step 6 - load the mongoose model for Image
  
var imgModel = require('./model');
var imgAModel = require('./newModel');




// Step 7 - the GET request handler that provides the HTML UI
  
app.get('/myDashboard', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('myDashboard', { items: items });
        }
    });
});

app.get('/', (req, res) => {
    imgAModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred');
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});


app.get('/upload', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }   
        else {
            res.render('imagesPage1', { items: items });
        }
    });
});

app.get('/mainUpload', (req, res) => {
    imgAModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }   
        else {
            res.render('mainUpload', { items: items });
        }
    });
});





// Step 8 - the POST handler for processing the uploaded file



app.post('/upload', upload.single('image'), (req, res, next) => {
  
    var obj = {
        name: req.body.name,
        distance: req.body.distance,
        date: req.body.date,
        author: req.body.author,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});



app.post('/mainUpload', upload.single('image'), (req, res, next) => {
  
    var obj = {
        name: req.body.name,
        distance: req.body.distance,
        date: req.body.date,
        author: req.body.author,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgAModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});






// Step 9 - configure the server's port
  
var PORT = process.env.PORT || 3002
app.listen(PORT, err => {
    if (err)
        throw err
    console.log('Server listening on port', PORT)
})



// app.listen(3002, function () {
//     console.log("Server is running on 3002");
//   });



// Static
const staticPath = path.join(__dirname, "./static");
app.use("/static",express.static(staticPath));






// login
const http = require('http');
const bcrypt = require('bcrypt');

const server = http.createServer(app);


// app.use(express.static(path.join(__dirname,'./sta')));


// app.get('/upload_button',(req,res) => {
//     res.sendFile(path.join(__dirname,'./static/auth.html'));

// });

const users = require('./data').userDB;




app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            // res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");

            // res.sendFile(path.join(__dirname,'./static/login.html'));

            
            // alert("Registration successful, please sign in");

            res.redirect('/static/auth.html');

        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch(err){
        console.log(err);
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                // res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
                res.render("imagesPage1");
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});



