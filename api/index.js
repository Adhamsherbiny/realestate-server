import express from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import mysql from "mysql";
 
const databaseConnect = mysql.createConnection({
    host:"sql8.freesqldatabase.com",
    user: "sql8731358",
    password:"RFQTTVgNJh" ,
    database:"sql8731358",
})


databaseConnect.connect((err)=>{
    if(err) throw err;
    console.log("database is ready to use")
})

const port = 5000
const app = express()
app.use(cors())
app.use(express.json())

app.get("/" , (req , res)=>{
    res.send("hello in server")
})

app.listen(port , ()=>{
    console.log(`app is listenning port ${port}`)
})
