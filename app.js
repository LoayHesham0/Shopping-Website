const { count } = require('console');
const e = require('express');

var express = require('express');
var path = require('path');
var app = express();

let alert = require('alert'); 
const { get } = require('jquery');
const { userInfo } = require('os');

var loggedIn;
var loggedInUser;
var loggedInUserData;
var registrationErrors=-1;
var homeErrors=-1;
///////////////////////////////////////////////////////
///////////////////USED FUNCTIONS//////////////////////
///////////////////////////////////////////////////////
async function insertData(inputUserName,inputPassword,res){
            const { MongoClient } = require("mongodb");                                                                                                                                       
            const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            const client = new MongoClient(url);
            const dbName = "ShopDB";               
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection("Users");                                                                                                                                                        
            let userEntries = {
                "username": inputUserName,
                "password": inputPassword,
                "cart":[]
            }
            const query = { username: inputUserName};
            const count = await col.countDocuments(query);
            if (count>0){
                registrationFailed(res);
                return;
            }
            else{
                const p = await col.insertOne(userEntries);
                registrationSuccess(inputUserName,inputPassword,res);
            }
            await client.close();
}
async function searchInDataLoginQuery(inputUserName,inputPassword,res,req){
    const { MongoClient } = require("mongodb");                                                                                                                                       
            const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            const client = new MongoClient(url);
            const dbName = "ShopDB";               
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection("Users");
            const query = {username: inputUserName,password :inputPassword};
            const count = await col.countDocuments(query);
            if (count==1){
                   loginSuccess(res,req,query);
            }
            else{
                   loginFailed(res);
            }
            await client.close();
}         
async function loginSuccess(res,req,query){
        loggedIn = true;
        loggedInUser = query;
        getUserAllData(loggedInUser);
        res.redirect('home');
}
async function loginFailed(res){
        registrationErrors = 0;
        res.render('registration',{registrationErrors});
        registrationErrors = -1;
}
async function registrationSuccess(inputUserName,inputPassword,res){
    searchInDataLoginQuery(inputUserName,inputPassword,res);
}
async function registrationFailed(res){
    registrationErrors = 3;
    res.render('registration',{registrationErrors});
    registrationErrors = -1;
}
async function addToCart(item,res){
            const { MongoClient } = require("mongodb");                                                                                                                                       
            const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
            const client = new MongoClient(url);
            const dbName = "ShopDB";               
            await client.connect();
            const db = client.db(dbName);
            const col = db.collection("Users");
            var myquery = loggedInUser;
            var newvalues = { $push: {cart: item}};
            col.updateOne(myquery, newvalues, async function(err, res) {
                await client.close();
            });
            await getUserAllData(loggedInUser);
            res.redirect('home');
            
}
async function getUserAllData(user){
    const { MongoClient } = require("mongodb");                                                                                                                                       
    const url = "mongodb+srv://venom:venom@cluster0.lyvpq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(url);
    await client.connect();
    const dbName = "ShopDB";  
    const db = client.db(dbName);
    const col = db.collection("Users");
    var data = await col.find().toArray();
    for(i = 0; i < data.length; i++){
        if(data[i].username.localeCompare(user.username) == 0 ){
            if(data[i].password.localeCompare(user.password) == 0){
                loggedInUserData = data[i];
            }
        }
    }
    client.close();
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//////////    GET    //////////
app.get('/',function(req,res){
    res.render('login',{title: "HomePage"})
});
app.get('/books',function(req,res){
    if (loggedIn != undefined){
        res.render('books')
    }
    else{
        res.redirect('/')
    }
    
});
app.get('/boxing',function(req,res){
    
    if (loggedIn != undefined){
        res.render('boxing')
    }
    else{
        res.redirect('/')
    }
});
app.get('/cart',function(req,res){
    if (loggedIn != undefined){
        res.render('cart',{loggedInUserData})
    }
    else{
        res.redirect('/')
    }
});
app.get('/galaxy',function(req,res){
    if (loggedIn != undefined){
        res.render('galaxy')
    }
    else{
        res.redirect('/')
    }
});
app.get('/iphone',function(req,res){
    if (loggedIn != undefined){
        res.render('iphone')
    }
    else{
        res.redirect('/')
    }
});
app.get('/leaves',function(req,res){
    if (loggedIn != undefined){
        res.render('leaves')
    }
    else{
        res.redirect('/')
    }
});
app.get('/home',function(req,res){
    if (loggedIn != undefined){
        res.render('home',{homeErrors})
    }
    else{
        res.redirect('/')
    }
});
app.get('/phones',function(req,res){
    if (loggedIn != undefined){
        res.render('phones')
    }
    else{
        res.redirect('/')
    }
});
app.get('/registration',function(req,res){
    res.render('registration',{registrationErrors});
});
app.get('/searchresults',function(req,res){
    if (loggedIn != undefined){
        res.render('searchresults')
    }
    else{
        res.redirect('/')
    }
});
app.get('/sports',function(req,res){
    if (loggedIn != undefined){
        res.render('sports')
    }
    else{
        res.redirect('/')
    }
});
app.get('/sun',function(req,res){
    if (loggedIn != undefined){
        res.render('sun')
    }
    else{
        res.redirect('/')
    }
});
app.get('/tennis',function(req,res){
    if (loggedIn != undefined){
        res.render('tennis')
    }
    else{
        res.redirect('/')
    }
});

//////////   POST    //////////

app.post('/',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    searchInDataLoginQuery(username, password,res,req);
});

app.post('/register',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if (username.length == 0 | password.length == 0){
        registrationErrors = 1;
        res.render("registration",{registrationErrors});
        registrationErrors = -1;
    }
    else{
        if(password.length < 8){
            registrationErrors = 2;
            res.render("registration",{registrationErrors});
            registrationErrors = -1;
        }else{
            insertData(username,password,res);
        }
    }
});

app.post('/iphone',function(req,res){
    if(loggedInUserData.cart.includes("iphone")){
        homeErrors = 0;
        res.render('home',{homeErrors});
        homeErrors=-1;
    }else{
        addToCart('iphone',res);
    }
    
});

app.post('/galaxy',function(req,res){
    if(loggedInUserData.cart.includes("galaxy")){
        homeErrors = 0;
        res.render('home',{homeErrors});
        homeErrors=-1;
    }
    else{
        addToCart('galaxy',res);
    }
});

app.post('/leaves', function(req, res){
    if(loggedInUserData.cart.includes("leaves")){
        homeErrors = 0;
        res.render('home',{homeErrors});
        homeErrors=-1;
    }
    else{
        addToCart('leaves',res);
    }
});

app.post('/sun', function(req, res){
    if(loggedInUserData.cart.includes("sun")){
        homeErrors = 0;
        res.render('home',{homeErrors});
        homeErrors=-1;
    }
    else{
        addToCart('sun',res);
    }
});

app.post('/boxing', function(req, res){
    if(loggedInUserData.cart.includes("boxing")){
        homeErrors = 0;
        res.render('home',{homeErrors});
        homeErrors=-1;
    }
    else{
        addToCart('boxing',res);
    }
});

app.post('/tennis', function(req, res){
    if(loggedInUserData.cart.includes("tennis")){
        homeErrors = 0;
        res.render('home',{homeErrors});
        homeErrors=-1;
    }
    else{
        addToCart('tennis',res);
    }
});

app.post('/search',function(req, res){
    var inventory = ['galaxy s21 ultra','iphone 13 pro','leaves of grass','the sun and her flowers','tennis racket','boxing bag'];
    var searchresults =[];
    let searchWord = (req.body.Search).toLowerCase();
    var found = inventory.includes(searchWord);
    for (let index = 0; index < inventory.length; index++) {
        const element = inventory[index];
        if (element.includes(searchWord) == true){
            if (element == 'galaxy s21 ultra'){
                searchresults.push('galaxy');
            }
            else if(element == 'iphone 13 pro'){
                searchresults.push('iphone');
            }
            else if(element == 'leaves of grass'){
                searchresults.push('leaves');
            }
            else if(element == 'the sun and her flowers'){
                searchresults.push('sun');
            }
            else if(element == 'tennis racket'){
                searchresults.push('tennis');
            }
            else if(element == 'boxing bag'){
                searchresults.push('boxing');
            }
        }
    }
    if (searchresults.length > 0){
        for (let index = 0; index < searchresults.length; index++) {
            res.render("searchresults", {searchresults})
        }
        
    }else{
        homeErrors = 1;
        res.render("home",{homeErrors});
        homeErrors = -1;
    }
});

if(process.env.PORT){
    app.listen(process.env.PORT,function(){console.log('Server Started')});
}else{
    app.listen(3000,function(){console.log('Server started on Port 3000')});
}
