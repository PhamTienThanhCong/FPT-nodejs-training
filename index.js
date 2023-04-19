const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
var session = require('express-session');
const bodyParser = require('body-parser');

const homeAdminRoute = require("./routes/admin/Home");
const categoryAdminRoute = require("./routes/admin/Category");
const productAdminRoute = require("./routes/admin/Product");
const authAdminRoute = require("./routes/admin/Auth");
const userAdminRoute = require("./routes/admin/User");
const cartAdminRoute = require("./routes/admin/Cart");
const orderAdminRoute = require("./routes/admin/Order");

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

// thêm middleware vào app.use('/', homeRoute);
app.use('/', middleware.settingMiddleware, homeRoute);
app.use('/', middleware.settingMiddleware, authRoute);
app.use('/', middleware.settingMiddleware, cartRoute);

app.use('/admin', homeAdminRoute);
app.use('/admin/category', categoryAdminRoute);
app.use('/admin/product', productAdminRoute);
app.use('/admin/auth', authAdminRoute);
app.use('/admin/customer', userAdminRoute);
app.use('/admin/cart',cartAdminRoute);
app.use('/admin/order', orderAdminRoute);

let port = 8000;
app.listen(port, () => console.log('server is running in port ' + port));