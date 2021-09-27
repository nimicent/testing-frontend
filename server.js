require('dotenv').config()
var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
var cors = require('cors');
const ibmdb = require('ibm_db');
const async = require('async');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var features = ['LOTAREA', 'BLDGTYPE', 'HOUSESTYLE', 'OVERALLCOND', 'YEARBUILT',
       'ROOFSTYLE', 'EXTERCOND', 'FOUNDATION', 'BSMTCOND', 'HEATING',
       'HEATINGQC', 'CENTRALAIR', 'ELECTRICAL', 'FULLBATH', 'HALFBATH',
       'BEDROOMABVGR', 'KITCHENABVGR', 'KITCHENQUAL', 'TOTRMSABVGRD',
       'FIREPLACES', 'FIREPLACEQU', 'GARAGETYPE', 'GARAGEFINISH', 'GARAGECARS',
       'GARAGECOND', 'POOLAREA', 'POOLQC', 'FENCE', 'MOSOLD', 'YRSOLD' ];


let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";PROTOCOL=TCPIP;UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";";
console.log(connStr);

app.post('/getData', function(request, response){
   ibmdb.open(connStr, function (err,conn) {
     if (err){
       return response.json({success:-1, message:err});
     }
     conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".HOME_SALES ORDER BY ID DESC LIMIT "+request.body.num+";", function (err, data) {
       if (err){
         return response.json({success:-1, message:err});
       }
       conn.close(function () {
         return response.json({success:1, message:'Data Received!', data:data});
       });
     });
   });
})

app.listen(8888, function(){
    console.log("Server is listening on port 8888");
})
