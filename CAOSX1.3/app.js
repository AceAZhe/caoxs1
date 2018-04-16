/**
 * Created by Administrator on 2018/4/6.
 */
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
//2:创建连接池
var pool = mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"caosx",
    port:3306,
    connectionLimit:25
});
//3:创建服务器 3000
var app = express();
app.listen(8111);
// //4:加载静态目录 public里面的文件静态文件的托管  浏览器需要输入localhost:8110/public
app.use("/public",express.static(__dirname+"/public"));
//5:配置 body parser
app.use(bodyParser.urlencoded({extended:false}));

//6:处理登录请求
app.get("/score",(req,res,next)=>{
    var sql="select * from scores where uid<=30 order by uscore DESC ";
    pool.getConnection(function(err,conn){
        if(err)throw err;
        conn.query(sql,function(err,result){
            if(err)throw err;
            if(result.length <0){
                res.json({code:-1,msg:"加载错误"});
            }else{
                res.json({code:1,msg:"加载成功",data:result});
            }
            conn.release();
        })
    })
});