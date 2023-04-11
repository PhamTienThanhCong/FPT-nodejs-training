const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
var session = require('express-session');
const bodyParser = require('body-parser');

const categoryApiRoute = require("./routes/apis/Category");
const productApiRoute = require("./routes/apis/Product");
const authApiRoute = require("./routes/apis/Auth");
const userApiRoute = require("./routes/apis/User");
const cartApiRoute = require("./routes/apis/Cart");
const orderApiRoute = require("./routes/apis/Order");

const homeRoute = require("./routes/Home");
const cartRoute = require("./routes/Cart");
const authRoute = require("./routes/Auth");

const middleware = require('./middleware/middleware'); 

dotenv.config();
const app = express();

app.set("views",__dirname + "/views");
app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect mongodb
mongoose.connect(process.env.MONGODB_URL, () => {
    if (mongoose.connection.readyState === 1) {
        console.log("Connected to MongoDB");
    } else {
        console.log("Error connecting to MongoDB " + mongoose.connection.readyState);
    }
})
mongoose.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
}); 

app.use(cors());
app.use(express.json());
app.use(morgan())
app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }
  }));
  

//routers
app.use('/v1/category', categoryApiRoute);
app.use('/v1/product', productApiRoute);
app.use('/v1/auth', authApiRoute);
app.use('/v1/user', userApiRoute);
app.use('/v1/cart',cartApiRoute);
app.use('/v1/order', orderApiRoute);

// thêm middleware vào app.use('/', homeRoute);
app.use('/', middleware.settingMiddleware, homeRoute);
app.use('/', middleware.settingMiddleware, authRoute);
app.use('/', middleware.authMiddleware, cartRoute);

let port = 8000;
app.listen(port, () => console.log('server is running in port ' + port));