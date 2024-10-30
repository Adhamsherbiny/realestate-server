import express, { response } from "express"
import cors from "cors"
import bcrypt from "bcrypt"
import mysql from "mysql";
 
const databaseConnect = mysql.createConnection({
    host:"bh4belfcjrq80irlh9dq-mysql.services.clever-cloud.com",
    user: "ulbztlplcjiazjxh",
    password:"A5PJbrPeFIhoshbPqIYc" ,
    database:"bh4belfcjrq80irlh9dq",
})




const port = 5000
const app = express()
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
}))
app.use(express.json())

app.get("/" , (req , res)=>{
    res.status(200).send(`
        Welcome to realestate server dashboard
        I know you are admin or developer enjoy on our server
        we are created this page to say welcome to you
        `)
})

app.post( "/singup", (req , res)=>{
    databaseConnect.connect((err)=>{
        if(err) throw err;
        res.json({error: err})
        console.log("database is ready to use")
    })
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const phone = req.body.phone
    databaseConnect.query(`SELECT * FROM users where username= '${username}'` , (err , result)=>{
        if(err) throw err;
        res.json({error: err})
        if(result.length > 0){
            return res.status(400).json({message: "username already exist"})
        }
        bcrypt.hash(password , 10 , (err , hash)=>{
            if(err) throw err;
            databaseConnect.query(`INSERT INTO users (username , email , password , phone , role) VALUES =?` ,[username , email , hash , phone , 1], (err , result)=>{
                if(err) throw err;
                res.json({error: err})
                res.status(200).json({message:"user created" , respon: result})
            })
        })
    })
})


app.listen(port , ()=>{
    console.log(`app is listenning port ${port}`)
})
