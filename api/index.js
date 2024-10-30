import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import mysql from "mysql";
 
const databaseConnect = mysql.createConnection({
    host:"bh4belfcjrq80irlh9dq-mysql.services.clever-cloud.com",
    user: "ulbztlplcjiazjxh",
    password:"A5PJbrPeFIhoshbPqIYc" ,
    database:"bh4belfcjrq80irlh9dq",
})


databaseConnect.connect((err)=>{
    if(err) throw err;
    console.log("database is ready to use")
})

const port = 5000
const app = express()
app.use(cors())
app.use(express.json())

app.get("/home" , (req , res)=>{
    res.send("hello in server")
})

app.get("/page" , (req , res)=>{
    res.json({msg: 'hello in page'})
})

app.listen(port , ()=>{
    console.log(`app is listenning port ${port}`)
})
