//import express module 
var express = require('express');
//create an express app
var app = express();
var alert = require('alert');
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

//Only user allowed is admin
var Users = [{
    "username": "admin",
    "password": "admin"
}];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('/home');
    } else
        res.render('login');
});

app.post('/login', function (req, res) {
    if (req.session.user) {
        res.render('/home');
    } else {
        console.log("Req Body : ", req.body);
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/home');
            }
            else{
                alert("Check your Username or Password");
                res.redirect('/login');
                var value =1; 
            }
        });
    }

});

app.get('/login', function(req, res){

    req.session.destroy();
    res.redirect('/');

});

app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books
        });
    }
});

app.get('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create');
    }
});

app.post('/create', function (req, res) {
    console.log(req.body)

    let item = req.body;
    let result = books.map( items => items.BookID )

    //console.log(result)

    if(result.includes(item.book_id)){

        alert("Please keep the book ID to be unique");
       
       
    }
    else{

        books.push({BookID:item.book_id, Title:item.book_title, Author:item.book_author});
    }

    console.log(books)
    res.redirect('/home');
});

app.get('/delete', function (req, res) {
    console.log("Session Data : ", req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete');
    }
});

app.post('/delete', function (req, res) {




    let flag = false;
    let index = -1;
    for (let book of books) {
        index++;
        if (req.body.book_id === book.BookID) {
            flag = true;
            break;
        }
    }

    if (flag) {
        
        console.log(index);
        books.splice(index, 1);
        res.redirect('/home');
     } else {
        alert("BookID Doesn't Exists");
    }
});
    

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});


app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});