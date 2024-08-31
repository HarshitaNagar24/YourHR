const express = require("express");
const {configDotenv} = require("dotenv");
const cors  = require("cors");
const path = require('path');
const {connectMongoDb} =require("./connect");
const {restrictTo, checkForAuthentication} =require("./middleWares/auth");

// initialize express
const app = express();


configDotenv();
const port = process.env.PORT || 8001;
const url = process.env.URL;

const userRoutes = require("./routes/user");
const adminRoute = require("./routes/admin");

// middleWare
app.use(express.static('build'));
// Serve static files (resumes) from the 'uploads' directory
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(checkForAuthentication); //Authentication Middleware


app.use("/user",userRoutes);
app.use("/admin",restrictTo(['ADMIN']),adminRoute);  //only admin role can access this

// Default route for React app (if needed)
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// connect to mongoDB
connectMongoDb(url).then(()=>console.log("Connected to database"));

app.get('/',(req,res)=>{
    res.send("Server is ready")
})


app.listen(port,()=>{console.log(`Server listing at port : ${port}`)});